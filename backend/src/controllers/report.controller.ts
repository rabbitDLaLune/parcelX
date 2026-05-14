import { Request, Response } from 'express';
import { db } from '../config/database';

export async function getReportSummary(_req: Request, res: Response): Promise<void> {
  try {
    const [rows] = await db.query<any[]>(`
      SELECT
        COUNT(*) AS totalParcels,
        SUM(CASE WHEN current_status = 'DELIVERED' THEN 1 ELSE 0 END) AS delivered,
        SUM(CASE WHEN current_status = 'IN_TRANSIT' THEN 1 ELSE 0 END) AS inTransit,
        SUM(CASE WHEN current_status = 'OUT_FOR_DELIVERY' THEN 1 ELSE 0 END) AS outForDelivery,
        SUM(CASE WHEN current_status = 'DELIVERY_FAILED' THEN 1 ELSE 0 END) AS failed,
        COALESCE(SUM(delivery_fee), 0) AS totalRevenue
      FROM parcels
    `);

    const stats = rows[0];

    res.status(200).json({
      success: true,
      data: {
        totalParcels: Number(stats.totalParcels || 0),
        delivered: Number(stats.delivered || 0),
        inTransit: Number(stats.inTransit || 0),
        outForDelivery: Number(stats.outForDelivery || 0),
        failed: Number(stats.failed || 0),
        totalRevenue: Number(stats.totalRevenue || 0),
      },
    });
  } catch (error) {
    console.error('Report summary error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to load report summary.',
    });
  }
}

export async function getParcelReport(req: Request, res: Response): Promise<void> {
  try {
    const status = String(req.query['status'] || 'ALL');
    const dateFrom = String(req.query['dateFrom'] || '');
    const dateTo = String(req.query['dateTo'] || '');

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (status !== 'ALL') {
      conditions.push('p.current_status = ?');
      params.push(status);
    }

    if (dateFrom) {
      conditions.push('DATE(p.created_at) >= ?');
      params.push(dateFrom);
    }

    if (dateTo) {
      conditions.push('DATE(p.created_at) <= ?');
      params.push(dateTo);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await db.query<any[]>(
      `
        SELECT
          p.parcel_id AS parcelId,
          p.tracking_number AS trackingNumber,
          p.sender_name AS senderName,
          p.receiver_name AS receiverName,
          p.receiver_address AS receiverAddress,
          p.current_status AS currentStatus,
          p.delivery_type AS deliveryType,
          p.delivery_fee AS deliveryFee,
          p.created_at AS createdAt,
          COALESCE(cb.branch_name, 'Unknown') AS latestLocation,
          d.full_name AS assignedDriver
        FROM parcels p
        LEFT JOIN branches cb ON p.current_branch_id = cb.branch_id
        LEFT JOIN drivers d ON p.assigned_driver_id = d.driver_id
        ${whereClause}
        ORDER BY p.created_at DESC
      `,
      params,
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Parcel report error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to load parcel report.',
    });
  }
}

export async function getRevenueReport(_req: Request, res: Response): Promise<void> {
  try {
    const [rows] = await db.query<any[]>(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') AS month,
        COUNT(*) AS totalShipments,
        COALESCE(SUM(delivery_fee), 0) AS revenue
      FROM parcels
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);

    res.status(200).json({
      success: true,
      data: rows.map((row) => ({
        month: row.month,
        totalShipments: Number(row.totalShipments || 0),
        revenue: Number(row.revenue || 0),
      })),
    });
  } catch (error) {
    console.error('Revenue report error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to load revenue report.',
    });
  }
}

export async function getDriverReport(_req: Request, res: Response): Promise<void> {
  try {
    const [rows] = await db.query<any[]>(`
      SELECT
        d.driver_id AS driverId,
        d.full_name AS driverName,
        d.phone,
        d.vehicle_type AS vehicleType,
        d.vehicle_number AS vehicleNumber,
        d.availability_status AS availabilityStatus,
        b.branch_name AS branchName,
        COUNT(p.parcel_id) AS assignedParcels,
        SUM(CASE WHEN p.current_status = 'DELIVERED' THEN 1 ELSE 0 END) AS delivered,
        SUM(CASE WHEN p.current_status = 'DELIVERY_FAILED' THEN 1 ELSE 0 END) AS failed
      FROM drivers d
      LEFT JOIN branches b ON d.branch_id = b.branch_id
      LEFT JOIN parcels p ON d.driver_id = p.assigned_driver_id
      GROUP BY
        d.driver_id,
        d.full_name,
        d.phone,
        d.vehicle_type,
        d.vehicle_number,
        d.availability_status,
        b.branch_name
      ORDER BY assignedParcels DESC
    `);

    res.status(200).json({
      success: true,
      data: rows.map((row) => ({
        driverId: row.driverId,
        driverName: row.driverName,
        phone: row.phone,
        vehicleType: row.vehicleType,
        vehicleNumber: row.vehicleNumber,
        availabilityStatus: row.availabilityStatus,
        branchName: row.branchName,
        assignedParcels: Number(row.assignedParcels || 0),
        delivered: Number(row.delivered || 0),
        failed: Number(row.failed || 0),
      })),
    });
  } catch (error) {
    console.error('Driver report error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to load driver report.',
    });
  }
}
