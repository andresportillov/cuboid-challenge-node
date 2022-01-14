import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { Id } from 'objection';
import { Cuboid, Bag } from '../models';

export const list = async (req: Request, res: Response): Promise<Response> => {
  const ids = req.query.ids as Id[];
  const cuboids = await Cuboid.query().findByIds(ids).withGraphFetched('bag');

  return res.status(200).json(cuboids);
};

export const get = async (req: Request, res: Response): Promise<Response> => {
  const id: Id = req.params.id;
  const cuboid = await Cuboid.query().findById(id);
  
  if (!cuboid) {
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
  
  return res.status(200).json(cuboid);
};

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { width, height, depth, bagId, volume } = req.body;

  if (volume > 504) {
   return  res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({message: 'Insufficient capacity in bag'});
  }

  const bag = await Bag.query().findById(bagId);

  if (!bag) {
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  const cuboid = await Cuboid.query().insert({
    width,
    height,
    depth,
    bagId
  });

  return res.status(HttpStatus.CREATED).json(cuboid);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { width, height, depth, bagId, volume } = req.body;
  const id: Id = req.params.id;

  if (volume > 216) {
    return res.sendStatus(HttpStatus.UNPROCESSABLE_ENTITY);
  }
  
  const cuboid = await Cuboid.query().patchAndFetchById(id, {
    width,
    height,
    depth,
    bagId
  });

  return res.status(HttpStatus.OK).json(cuboid);
};

export const cuboid_delete = async (req: Request,res: Response): Promise<Response> => {
  const id: Id = req.params.id;
  const cuboid = await Cuboid.query().findById(id);

  if (!cuboid) {
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  const cuboidDelete = await Cuboid.query().deleteById(id);

  return res.status(HttpStatus.OK).json(cuboidDelete);
};
