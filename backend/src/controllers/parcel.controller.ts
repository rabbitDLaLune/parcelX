import { Request, Response } from 'express';
import {
  assignDriverToParcelInDb,
  createParcelInDb,
  getAllParcelsFromDb,
  getDashboardStatsFromDb,
  getParcelByIdFromDb,
  markParcelDeliveredInDb,
  markParcelFailedInDb,
  updateParcelStatusInDb,
} from '../services/parcel-db.service';

export async function getAllParcels(_req: Request, res: Response): Promise<void> {
  try {
    const parcels = await getAllParcelsFromDb();

    res.status(200).json({
      success: true,
      data: parcels,
    });
  } catch (error) {
    console.error('Get all parcels error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to load parcels.',
    });
  }
}

export async function getParcelById(req: Request, res: Response): Promise<void> {
  try {
    const parcelId = Number(req.params['id']);

    if (!parcelId) {
      res.status(400).json({
        success: false,
        message: 'Valid parcel ID is required.',
      });
      return;
    }

    const parcel = await getParcelByIdFromDb(parcelId);

    if (!parcel) {
      res.status(404).json({
        success: false,
        message: 'Parcel not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: parcel,
    });
  } catch (error) {
    console.error('Get parcel by ID error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to load parcel.',
    });
  }
}

export async function getDashboardStats(_req: Request, res: Response): Promise<void> {
  try {
    const stats = await getDashboardStatsFromDb();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard stats.',
    });
  }
}

export async function createParcel(req: Request, res: Response): Promise<void> {
  try {
    const payload = req.body;

    if (
      !payload.senderName ||
      !payload.senderPhone ||
      !payload.senderAddress ||
      !payload.receiverName ||
      !payload.receiverPhone ||
      !payload.receiverAddress ||
      !payload.originBranchId ||
      !payload.destinationBranchId ||
      !payload.parcelWeight ||
      !payload.parcelSize ||
      !payload.deliveryType
    ) {
      res.status(400).json({
        success: false,
        message: 'Missing required parcel fields.',
      });
      return;
    }

    const parcel = await createParcelInDb(payload);

    res.status(201).json({
      success: true,
      message: 'Parcel created successfully.',
      data: parcel,
    });
  } catch (error) {
    console.error('Create parcel error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create parcel.',
    });
  }
}

export async function updateParcelStatus(req: Request, res: Response): Promise<void> {
  try {
    const parcelId = Number(req.params['id']);

    if (!parcelId) {
      res.status(400).json({
        success: false,
        message: 'Valid parcel ID is required.',
      });
      return;
    }

    const payload = req.body;

    if (!payload.status || !payload.title || !payload.locationName) {
      res.status(400).json({
        success: false,
        message: 'Status, title, and location name are required.',
      });
      return;
    }

    const parcel = await updateParcelStatusInDb(parcelId, payload);

    if (!parcel) {
      res.status(404).json({
        success: false,
        message: 'Parcel not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Parcel status updated successfully.',
      data: parcel,
    });
  } catch (error) {
    console.error('Update parcel status error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update parcel status.',
    });
  }
}

export async function assignDriver(req: Request, res: Response): Promise<void> {
  try {
    const parcelId = Number(req.params['id']);
    const driverId = Number(req.body.driverId);

    if (!parcelId || !driverId) {
      res.status(400).json({
        success: false,
        message: 'Parcel ID and driver ID are required.',
      });
      return;
    }

    const parcel = await assignDriverToParcelInDb(parcelId, {
      driverId,
      assignedBy: req.body.assignedBy || 'Admin',
    });

    if (!parcel) {
      res.status(404).json({
        success: false,
        message: 'Parcel not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Driver assigned successfully.',
      data: parcel,
    });
  } catch (error) {
    console.error('Assign driver error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to assign driver.',
    });
  }
}

export async function markDelivered(req: Request, res: Response): Promise<void> {
  try {
    const parcelId = Number(req.params['id']);

    if (!parcelId) {
      res.status(400).json({
        success: false,
        message: 'Valid parcel ID is required.',
      });
      return;
    }

    const parcel = await markParcelDeliveredInDb(parcelId, {
      receiverName: req.body.receiverName || 'Receiver',
      deliveryNote: req.body.deliveryNote,
    });

    if (!parcel) {
      res.status(404).json({
        success: false,
        message: 'Parcel not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Parcel marked as delivered.',
      data: parcel,
    });
  } catch (error) {
    console.error('Mark delivered error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to mark parcel as delivered.',
    });
  }
}

export async function markFailed(req: Request, res: Response): Promise<void> {
  try {
    const parcelId = Number(req.params['id']);

    if (!parcelId) {
      res.status(400).json({
        success: false,
        message: 'Valid parcel ID is required.',
      });
      return;
    }

    const reason = req.body.reason || 'Delivery failed.';

    const parcel = await markParcelFailedInDb(parcelId, reason);

    if (!parcel) {
      res.status(404).json({
        success: false,
        message: 'Parcel not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Parcel marked as failed.',
      data: parcel,
    });
  } catch (error) {
    console.error('Mark failed error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to mark parcel as failed.',
    });
  }
}
