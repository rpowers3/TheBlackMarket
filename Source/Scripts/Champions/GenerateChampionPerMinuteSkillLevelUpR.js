//
// Dependencies:
//   PrepareMatchEvents
//
db.MatchEvents.aggregate(
  [
    {
      $match: {
        "eventType": "SKILL_LEVEL_UP"
      }
    },
    {
      $group: {
        _id: {
          region: "$region",
          skillSlot: "$skillSlot",
          oneMinuteInterval: "$oneMinuteInterval"
        },
        leveledUp: { $sum: 1 },
        timesWon: { $sum: { $cmp: ["$source.w", false] } }
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
          region: "$_id.region",
          skillSlot: "$_id.skillSlot",
        },
        times: { $push: "$_id.oneMinuteInterval" },
        leveledUp: { $push: "$leveledUp" },
        timesWon: { $push: "$timesWon" },
      }
    },
    {
      $sort: {
        "_id.skillSlot": 1
      }
    },
    {
      $group: {
        _id: {
          region: "$_id.region"
        },
        skills: {
          $push: {
            skillSlot: "$_id.skillSlot",
            times: "$times",
            leveledUp: "$leveledUp",
            timesWon: "$timesWon",
          }
        }
      }
    }
    ,
    {
      $out: "ChampionPerMinuteSkillLevelUpR"
    }
  ],
  {
    allowDiskUse: true
  }
);
