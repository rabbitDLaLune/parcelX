import { db } from '../config/database';
import { Parcel } from '../types/parcel.types';
import { DashboardStatsRow, ParcelRow, TrackingEventRow } from '../types/mysql-row.types';
import { mapParcelRow, mapTrackingEventRow } from '../utils/parcel.mapper';

import {
  AssignDriverRequest,
  CreateParcelRequest,
  DeliveryProofRequest,
  UpdateParcelStatusRequest,
} from '../types/request.types';

const parcelSelectQuery = `
  SELECT
    p.parcel_id,
    p.tracking_number,
    p.sender_name,
    p.sender_phone,
    p.sender_address,
    p.receiver_name,
    p.receiver_phone,
    p.receiver_address,
    CONCAT(ob.branch_code, ' - ', ob.branch_name) AS origin_branch,
    CONCAT(dbh.branch_code, ' - ', dbh.branch_name) AS destination_branch,
    COALESCE(cb.branch_name, 'Unknown') AS latest_location,
    d.full_name AS assigned_driver,
    p.parcel_weight,
    p.parcel_size,
    p.parcel_category,
    p.delivery_type,
    p.delivery_fee,
    p.current_status,
    p.estimated_delivery_date,
    p.created_at
  FROM parcels p
  LEFT JOIN branches ob ON p.origin_branch_id = ob.branch_id
  LEFT JOIN branches dbh ON p.destination_branch_id = dbh.branch_id
  LEFT JOIN branches cb ON p.current_branch_id = cb.branch_id
  LEFT JOIN drivers d ON p.assigned_driver_id = d.driver_id
`;

export async function getTrackingEventsByParcelId(
  parcelId: number,
): Promise<ReturnType<typeof mapTrackingEventRow>[]> {
  const [rows] = await db.query<TrackingEventRow[]>(
    `
      SELECT
        event_id,
        parcel_id,
        status,
        title,
        location_name,
        latitude,
        longitude,
        remarks,
        updated_by,
        created_at
      FROM tracking_events
      WHERE parcel_id = ?
      ORDER BY created_at ASC
    `,
    [parcelId],
  );

  return rows.map(mapTrackingEventRow);
}

export async function getAllParcelsFromDb(): Promise<Parcel[]> {
  const [rows] = await db.query<ParcelRow[]>(
    `
      ${parcelSelectQuery}
      ORDER BY p.created_at DESC
    `,
  );

  const parcels = await Promise.all(
    rows.map(async (row) => {
      const trackingEvents = await getTrackingEventsByParcelId(row.parcel_id);
      return mapParcelRow(row, trackingEvents);
    }),
  );

  return parcels;
}

export async function getParcelByIdFromDb(parcelId: number): Promise<Parcel | null> {
  const [rows] = await db.query<ParcelRow[]>(
    `
      ${parcelSelectQuery}
      WHERE p.parcel_id = ?
      LIMIT 1
    `,
    [parcelId],
  );

  const row = rows[0];

  if (!row) return null;

  const trackingEvents = await getTrackingEventsByParcelId(row.parcel_id);

  return mapParcelRow(row, trackingEvents);
}

export async function getParcelByTrackingNumberFromDb(
  trackingNumber: string,
): Promise<Parcel | null> {
  const [rows] = await db.query<ParcelRow[]>(
    `
      ${parcelSelectQuery}
      WHERE p.tracking_number = ?
      LIMIT 1
    `,
    [trackingNumber],
  );

  const row = rows[0];

  if (!row) return null;

  const trackingEvents = await getTrackingEventsByParcelId(row.parcel_id);

  return mapParcelRow(row, trackingEvents);
}

export async function getDashboardStatsFromDb() {
  const [rows] = await db.query<DashboardStatsRow[]>(
    `
      SELECT
        COUNT(*) AS totalParcels,
        SUM(CASE WHEN current_status = 'IN_TRANSIT' THEN 1 ELSE 0 END) AS inTransit,
        SUM(CASE WHEN current_status = 'OUT_FOR_DELIVERY' THEN 1 ELSE 0 END) AS outForDelivery,
        SUM(CASE WHEN current_status = 'DELIVERED' THEN 1 ELSE 0 END) AS delivered,
        SUM(CASE WHEN current_status = 'DELIVERY_FAILED' THEN 1 ELSE 0 END) AS failed,
        COALESCE(SUM(delivery_fee), 0) AS totalRevenue
      FROM parcels
    `,
  );

  const stats = rows[0];

  return {
    totalParcels: Number(stats?.totalParcels || 0),
    inTransit: Number(stats?.inTransit || 0),
    outForDelivery: Number(stats?.outForDelivery || 0),
    delivered: Number(stats?.delivered || 0),
    failed: Number(stats?.failed || 0),
    totalRevenue: Number(stats?.totalRevenue || 0),
    activeDrivers: 8,
  };
}

function generateTrackingNumber(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');

  return `PXL${year}${month}${day}${random}`;
}

export async function createParcelInDb(payload: CreateParcelRequest): Promise<Parcel> {
  const trackingNumber = generateTrackingNumber();

  const currentBranchId = payload.currentBranchId || payload.originBranchId;

  const [result] = await db.execute<any>(
    `
      INSERT INTO parcels
      (
        tracking_number,
        sender_name,
        sender_phone,
        sender_address,
        receiver_name,
        receiver_phone,
        receiver_address,
        origin_branch_id,
        destination_branch_id,
        current_branch_id,
        parcel_weight,
        parcel_size,
        parcel_category,
        delivery_type,
        delivery_fee,
        current_status,
        estimated_delivery_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CREATED', ?)
    `,
    [
      trackingNumber,
      payload.senderName,
      payload.senderPhone,
      payload.senderAddress,
      payload.receiverName,
      payload.receiverPhone,
      payload.receiverAddress,
      payload.originBranchId,
      payload.destinationBranchId,
      currentBranchId,
      payload.parcelWeight,
      payload.parcelSize,
      payload.parcelCategory,
      payload.deliveryType,
      payload.deliveryFee,
      payload.estimatedDeliveryDate,
    ],
  );

  const parcelId = result.insertId;

  await db.execute(
    `
      INSERT INTO tracking_events
      (
        parcel_id,
        status,
        title,
        location_name,
        branch_id,
        remarks,
        updated_by
      )
      VALUES (?, 'CREATED', 'Parcel Created', 'Origin Branch', ?, 'Parcel has been registered in ParcelX.', 'Staff')
    `,
    [parcelId, currentBranchId],
  );

  const createdParcel = await getParcelByIdFromDb(parcelId);

  if (!createdParcel) {
    throw new Error('Failed to load created parcel.');
  }

  return createdParcel;
}

export async function updateParcelStatusInDb(
  parcelId: number,
  payload: UpdateParcelStatusRequest,
): Promise<Parcel | null> {
  const existingParcel = await getParcelByIdFromDb(parcelId);

  if (!existingParcel) {
    return null;
  }

  await db.execute(
    `
      UPDATE parcels
      SET
        current_status = ?,
        current_branch_id = COALESCE(?, current_branch_id)
      WHERE parcel_id = ?
    `,
    [payload.status, payload.branchId || null, parcelId],
  );

  await db.execute(
    `
      INSERT INTO tracking_events
      (
        parcel_id,
        status,
        title,
        location_name,
        branch_id,
        latitude,
        longitude,
        remarks,
        updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      parcelId,
      payload.status,
      payload.title,
      payload.locationName,
      payload.branchId || null,
      payload.latitude || null,
      payload.longitude || null,
      payload.remarks,
      payload.updatedBy,
    ],
  );

  return getParcelByIdFromDb(parcelId);
}

export async function assignDriverToParcelInDb(
  parcelId: number,
  payload: AssignDriverRequest,
): Promise<Parcel | null> {
  const existingParcel = await getParcelByIdFromDb(parcelId);

  if (!existingParcel) {
    return null;
  }

  const [driverRows] = await db.query<any[]>(
    `
      SELECT driver_id, full_name, branch_id
      FROM drivers
      WHERE driver_id = ?
      LIMIT 1
    `,
    [payload.driverId],
  );

  const driver = driverRows[0];

  if (!driver) {
    throw new Error('Driver not found.');
  }

  await db.execute(
    `
      UPDATE parcels
      SET
        assigned_driver_id = ?,
        current_status = 'ASSIGNED_TO_DRIVER'
      WHERE parcel_id = ?
    `,
    [payload.driverId, parcelId],
  );

  await db.execute(
    `
      INSERT INTO tracking_events
      (
        parcel_id,
        status,
        title,
        location_name,
        branch_id,
        remarks,
        updated_by
      )
      VALUES (?, 'ASSIGNED_TO_DRIVER', 'Assigned to Driver', 'Driver Assignment', ?, ?, ?)
    `,
    [
      parcelId,
      driver.branch_id || null,
      `Parcel has been assigned to ${driver.full_name}.`,
      payload.assignedBy || 'Admin',
    ],
  );

  return getParcelByIdFromDb(parcelId);
}

export async function markParcelDeliveredInDb(
  parcelId: number,
  payload: DeliveryProofRequest,
): Promise<Parcel | null> {
  const existingParcel = await getParcelByIdFromDb(parcelId);

  if (!existingParcel) {
    return null;
  }

  await db.execute(
    `
      UPDATE parcels
      SET current_status = 'DELIVERED'
      WHERE parcel_id = ?
    `,
    [parcelId],
  );

  await db.execute(
    `
      INSERT INTO tracking_events
      (
        parcel_id,
        status,
        title,
        location_name,
        remarks,
        updated_by
      )
      VALUES (?, 'DELIVERED', 'Delivered', ?, ?, 'Driver')
    `,
    [
      parcelId,
      existingParcel.latestLocation,
      payload.deliveryNote || `Parcel has been delivered to ${payload.receiverName}.`,
    ],
  );

  return getParcelByIdFromDb(parcelId);
}

export async function markParcelFailedInDb(
  parcelId: number,
  reason: string,
): Promise<Parcel | null> {
  const existingParcel = await getParcelByIdFromDb(parcelId);

  if (!existingParcel) {
    return null;
  }

  await db.execute(
    `
      UPDATE parcels
      SET current_status = 'DELIVERY_FAILED'
      WHERE parcel_id = ?
    `,
    [parcelId],
  );

  await db.execute(
    `
      INSERT INTO tracking_events
      (
        parcel_id,
        status,
        title,
        location_name,
        remarks,
        updated_by
      )
      VALUES (?, 'DELIVERY_FAILED', 'Delivery Failed', ?, ?, 'Driver')
    `,
    [parcelId, existingParcel.latestLocation, reason],
  );

  return getParcelByIdFromDb(parcelId);
}
