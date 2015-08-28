//
// Dependencies:
//   PrepareMatchEvents
//
db.MatchEvents.aggregate(
  [
    {
      $match: {
        "eventType": "BUILDING_KILL"
      }
    },
    {
      $group: {
        _id: {
          teamId: { $ifNull: [ "$source.t", { $cond: [ { $eq: [ "$team.t", 100 ] }, 200, 100 ] } ] },
          laneType: "$laneType",
          towerType: "$towerType",
          oneMinuteInterval: "$oneMinuteInterval"
        },
        count: { $sum: 1 },
        timesWon: { $sum: { $cmp: [{ $ifNull: ["$source.w", { $not: "$team.w" }] }, false] } }
      }
    },
    {
      $sort: {
        "_id.oneMinuteInterval": 1
      }
    },
    {
      $group: {
        _id: {
          teamId: "$_id.teamId",
          laneType: "$_id.laneType",
          towerType: "$_id.towerType"
        },
        times: { $push: "$_id.oneMinuteInterval" },
        count: { $push: "$count" },
        timesWon: { $push: "$timesWon" },
      }
    },
    {
      $sort: {
        "_id.laneType": 1,
        "_id.towerType": 1
      }
    },
    {
      $group: {
        _id: {
          teamId: "$_id.teamId"
        },
        buildings: {
          $push: {
            lane: "$_id.laneType",
            type: "$_id.towerType",
            times: "$times",
            count: "$count",
            timesWon: "$timesWon",
          }
        }
      }
    }
    ,
    {
      $out: "BuildingPerMinuteKillT"
    }
  ],
  {
    allowDiskUse: true
  }
);
