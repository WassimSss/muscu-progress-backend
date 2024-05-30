import {Response} from "express";

const checkData = (data: object, res:Response, message: string, needToBeEmptyForSuccess = true) => {
  const keyName = Object.keys(data)[0]
  console.log('needToBeEmptyForSuccess', needToBeEmptyForSuccess)
  console.log(data[keyName])
  if(needToBeEmptyForSuccess){
  if (data[keyName]) {
    return res.status(400).json({
      result: false,
      message: message
    });
  } 
} else {
  if (!data[keyName]) {
    return res.status(400).json({
      result: false,
      message: message
    });
  }
}
}

export { checkData }; // Add this line to export the checkUser function
