const fs = require("fs");
const axios = require("axios");
const jwt = require("jsonwebtoken");

let rawdata = fs.readFileSync("./devmod.json");
let thanks = JSON.parse(rawdata);

console.log("Total Users:", Object.keys(thanks).length);

Object.keys(thanks).forEach((u, index) => {
  domagic(u);
  let per = (index / Object.keys(thanks).length) * 100;
  console.log(per.toPrecision(2) + "%");
});

async function domagic(uid) {
  let points = thanks[uid].length * 10;
  givePoints(uid, points);
}

async function getUser(uid) {
  const token = getToken(uid);
  try {
    const resp = await axios(process.env.API + "/user/" + uid, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return resp.data.data;
  } catch ({ response }) {
    const { status, data } = response;
    if (status == 404) {
      // user doesn't exist, time to create user
      return await createUser(uid);
    }
    throw {
      status,
      data,
    };
  }
}

async function createUser(uid) {
  const u = { id: uid, totalPoints: 0 };
  try {
    const resp = await axios(process.env.API + "/user/", {
      method: "POST",
      data: u,
      headers: { "Content-Type": "application/json" },
    });
    return resp.data.data;
  } catch (e) {
    if (e && e.response) console.error(e.response.data);
    else throw e;
  }
}

async function givePoints(u, amount) {
  const user = await getUser(u);
  if (user) {
    user.totalPoints = amount;
    updateUser(user);
  } else console.log("User is undefined");
}

function getToken(id) {
  return jwt.sign({ id }, process.env.SECRET);
}

async function updateUser(user) {
  const token = getToken(user.id);
  try {
    const resp = await axios(process.env.API + "/user/" + user.id + "/points", {
      method: "POST",
      data: user,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return resp.data.data;
  } catch (e) {
    if (e && e.response) console.error(e.response.data);
    else throw e;
  }
}
