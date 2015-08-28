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
          global: "global"
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
      $out: "BuildingPerMinuteKillG"
    }
  ],
  {
    allowDiskUse: true
  }
);
