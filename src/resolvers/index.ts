import * as Models from './models'
import { Mutation } from './Mutations'
import { Subscription } from './Subscriptions'
import { Query } from './Queries'

export const resolvers = {
  ...Models,
  Query,
  Mutation,
  Subscription,
}


export const sendNotification = function(data: any) {
  let headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": `Basic ${process.env.ONE_SIGNAL_API_KEY}`
  };

  let options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };

  let https = require('https');
  let req = https.request(options, function(res:any) {
    res.on('data', function(data:any) {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });

  req.on('error', function(e:any) {
    console.log("ERROR:");
    console.log(e);
  });

  req.write(JSON.stringify(data));
  req.end();
};

