import { Request, Response } from 'express';
import { IUser, User } from '../../models/users';
import { checkData } from '../../modules/checkData';
import { checkAdmin } from '../../modules/checkAdmin';
import { Weight } from '../../models/weights';
import moment from 'moment';

declare module 'express' {
    
  interface Request {
      user?: IUser;
  }
}

const add =  async (req : Request, res: Response) => {
  try {
  const idUser = req.user?.id;

  const user = await User.findById(idUser) as IUser;
  // Check if the user is an admin
  if(checkAdmin(user, res)){
    return;
  }
  // Check if the user exists 
  if(checkData({ idUser: idUser }, res, 'Utilisateur non trouvé', false)){
    return;
  }

  const today = moment().utcOffset(0, true);
  const { weight } = req.body;

  // // Check if the weight is provided
  if(checkData({weight: weight}, res, "Le poids est requis", false)){
    return;
  }

  // Add the weight to the user
  await User.updateOne({_id: idUser}, { $push: { weights: {weight: weight, date: today} } })

    return res.json({
      result: true,
      message: 'Poids ajouté avec succès',
    });
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      result: false,
      message: 'Erreur lors de l\'ajout du poids',
    });

  }
}

const get = async (req: Request, res: Response) => {
  const idUser = req.user?.id;
  // const { date } = req.params;

  // Check if the user exists 
  if (!idUser) {
    return res.status(404).json({ result: false, message: 'Utilisateur non trouvé' });
  }

  // const parsedDate = moment(date, 'YYYY-MM-DD').utcOffset(0, true);
  // if (!parsedDate.isValid()) {
  //   return res.status(400).json({ result: false, message: 'Date invalide' });
  // }

  // const startOfDay = moment().utcOffset(0, true).startOf('day').toDate();
  // const endOfDay = moment().utcOffset(0, true).endOf('day').toDate();

  
  const weights = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(idUser) } },
    { $unwind: '$weights' },
    // { $match: { 'workouts.date': { $gte: startOfDay, $lt: endOfDay } } },
    {
      $lookup: {
        from: 'workoutexercises', 
        localField: 'workouts.workout',
        foreignField: '_id',
        as: 'workoutDetails'
      }
    },
    { $unwind: '$workoutDetails' },
    {
      $lookup: {
        from: 'musclegroups',
        localField: 'workoutDetails.muscleGroup',
        foreignField: '_id',
        as: 'muscleGroupDetails'
      }
    },
    { $unwind: '$muscleGroupDetails' },
    {
      $lookup: {
        from: 'exercises',
        localField: 'workoutDetails.name',
        foreignField: '_id',
        as: 'exerciseDetails'
      }
    },
    { $unwind: '$exerciseDetails' },
    { $unwind: '$workoutDetails.sets' }, // Unwind sets to get individual sets
    {
      $project: {
        _id: 0,
        muscleGroup: '$muscleGroupDetails.name',
        exerciseName: '$exerciseDetails.name',
        weight: '$workoutDetails.sets.weight',
        reps: '$workoutDetails.sets.repetitions',
        idSet: '$workoutDetails.sets._id', // Include workout ID
      }
    }
  ]);

  // Structure the results
  const groupedWorkouts = workouts.reduce((acc, workout) => {
    const { muscleGroup, exerciseName, weight, reps, idSet } = workout;

    let muscleGroupEntry = acc.find(group => group.muscleGroup === muscleGroup);

    if (!muscleGroupEntry) {
      muscleGroupEntry = { muscleGroup, exercises: [] };
      acc.push(muscleGroupEntry);
    }

    let exerciseEntry = muscleGroupEntry.exercises.find(exercise => exercise.name === exerciseName);

    if (!exerciseEntry) {
      exerciseEntry = { name: exerciseName, sets: [] };
      muscleGroupEntry.exercises.push(exerciseEntry);
    }

    exerciseEntry.sets.push({ weight, reps, idSet });

    return acc;
  }, []);

  return res.json({
    result: true,
    workouts: groupedWorkouts
  });
};

const removeWeight = async (req: Request, res: Response) => {
  const idUser = req.user?.id;
  const { idWeight } = req.params;

  // Check if the user exists 
  if (checkData({ idUser: idUser }, res, 'Utilisateur non trouvé', false)) {
    return;
  }

  // Check if the idWeight is provided
  if (checkData({ idWeight: idWeight }, res, "L'id du poids est requis", false)) {
    return;
  }

  const weight = await User.findOne({ _id: idUser, 'weights._id': idWeight });

  if (!weight) {
    return res.json({
      result: false,
      message: 'Poids non trouvée'
    });
  }


  const deletedSet = await User.updateOne(
    { user: idUser, 'weights._id': idWeight },
    { $pull: { weights: { _id: idWeight } } }
  );

  if (deletedSet.modifiedCount === 0) {
    return res.status(404).json({
      result: false,
      message: 'Poids non trouvé ou déjà supprimé'
    });
  }

  res.json({
          result: true,
          message: 'Poids supprimée avec succès'
        });
}

module.exports =  {add, removeWeight} ;
export {}