import { Request, Response } from 'express';
import { getParcelByTrackingNumberFromDb } from '../services/parcel-db.service';

export async function trackParcel(req: Request, res: Response): Promise<void> {
  try {
    const rawTrackingNumber = req.params['trackingNumber'];

    const trackingNumber = Array.isArray(rawTrackingNumber)
      ? rawTrackingNumber[0]?.trim().toUpperCase()
      : rawTrackingNumber?.trim().toUpperCase();

    if (!trackingNumber) {
      res.status(400).json({
        success: false,
        message: 'Tracking number is required.',
      });
      return;
    }

    const parcel = await getParcelByTrackingNumberFromDb(trackingNumber);

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
    console.error('Track parcel error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to track parcel.',
    });
  }
}
