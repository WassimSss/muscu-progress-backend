import {Response} from "express";

const checkData = (data: object, res:Response ) => {
  const keyName = Object.keys(data)[0]
  if (!data[keyName]) {
    return res.status(400).json({
      result: false,
      message: `Erreur lors de la récupération de ${keyName}`
    });
  }
}
export { checkData }; // Add this line to export the checkUser function
