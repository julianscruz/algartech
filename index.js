const AWS = require('aws-sdk');
const { v4: uuidv4} = require('uuid');
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.crear = async (event) => {
  const { nombre, apellido, correo } = JSON.parse(event.body);

  if (!nombre || !apellido || !correo) {
    return {
      statusCode: 404,
      body: JSON.stringify({ mensaje: 'no se enceuntran todos lso datos' })
    }
  }

  const id = uuidv4();

  const params = {
    TableName: 'usuarios',
    Item: { id, nombre, apellido, correo }
  }

  try {
    await dynamo.put(params).promise();
    return {
      statusCodeCode: 200,
      body: JSON.stringify({ id, nombre, apellido, correo })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ mensaje: 'No se pudo crear el usuario', error: error })
    }
  }
}

module.exports.consultar = async (event) => {
  const params = {
    TableName: 'usuarios',
  }

  try {
    const data = await dynamo.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ mensaje: 'No se pudo consultar usuarios', error: error })
    }
  }
}

module.exports.consultarId = async (event) => {
  const { id } = JSON.parse(event.body);

  const params = {
    TableName: 'usuarios',
    Key: { id }
  }

  try {
    const data = await dynamo.get(params).promise();

    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'no esta el uausario' })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data.Item)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ mensaje: 'No se pudo consultar usuario por id', error: error })
    }
  }

}