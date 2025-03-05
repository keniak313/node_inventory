export const checkIfExists = async (value, func) =>{
const isExist = await func;
if (isExist) {
    throw new Error(`'${value}' aleady exists.`);
  }
}

export const checkPassword = (value) =>{
  if(value != "haselko"){
    throw new Error("Wrong password!")
  }
}