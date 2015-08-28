// Generate a document store with only the match events data flattened out.
// This is done to make future work on the events data quicker.
//
// This query is extremely slow. It could probably be optimized if some
// assumptions were made about participant ids and team assignments.
//
db.Matches.aggregate(
  {
    $unwind: "$timeline.frames"
  },
  {
    $unwind: "$timeline.frames.events"
  },
  {
    $project: {
      matchId: true,
      region: true,
      platformId: true,
      matchCreation: true,
      time: {
        $add: [new Date(0), "$matchCreation", "$timeline.frames.events.timestamp"]
      },
      oneMinuteInterval: {
        $subtract: [
          { $divide: ["$timeline.frames.events.timestamp", 60000] },
          { $mod: [{ $divide: ["$timeline.frames.events.timestamp", 60000] }, 1] }
        ]
      },
      fiveMinuteInterval: {
        $subtract: [
          { $divide: ["$timeline.frames.events.timestamp", 300000] },
          { $mod: [{ $divide: ["$timeline.frames.events.timestamp", 300000] }, 1] }
        ]
      },
      p1win: { $anyElementTrue: { $map: { input: "$participants", as: "participant", in: { $and: [{ $eq: ["$$participant.participantId", 1] }, "$$participant.stats.winner"] } } } },
      p2win: { $anyElementTrue: { $map: { input: "$participants", as: "participant", in: { $and: [{ $eq: ["$$participant.participantId", 2] }, "$$participant.stats.winner"] } } } },
      p3win: { $anyElementTrue: { $map: { input: "$participants", as: "participant", in: { $and: [{ $eq: ["$$participant.participantId", 3] }, "$$participant.stats.winner"] } } } },
      p4win: { $anyElementTrue: { $map: { input: "$participants", as: "participant", in: { $and: [{ $eq: ["$$participant.participantId", 4] }, "$$participant.stats.winner"] } } } },
      p5win: { $anyElementTrue: { $map: { input: "$participants", as: "participant", in: { $and: [{ $eq: ["$$participant.participantId", 5] }, "$$participant.stats.winner"] } } } },
      p6win: { $anyElementTrue: { $map: { input: "$participants", as: "participant", in: { $and: [{ $eq: ["$$participant.participantId", 6] }, "$$participant.stats.winner"] } } } },
      p7win: { $anyElementTrue: { $map: { input: "$participants", as: "participant", in: { $and: [{ $eq: ["$$participant.participantId", 7] }, "$$participant.stats.winner"] } } } },
      p8win: { $anyElementTrue: { $map: { input: "$participants", as: "participant", in: { $and: [{ $eq: ["$$participant.participantId", 8] }, "$$participant.stats.winner"] } } } },
      p9win: { $anyElementTrue: { $map: { input: "$participants", as: "participant", in: { $and: [{ $eq: ["$$participant.participantId", 9] }, "$$participant.stats.winner"] } } } },
      p10win: { $anyElementTrue: { $map: { input: "$participants", as: "participant", in: { $and: [{ $eq: ["$$participant.participantId", 10] }, "$$participant.stats.winner"] } } } },
      team1win: { $anyElementTrue: { $map: { input: "$teams", as: "team", in: { $and: [{ $eq: ["$$team.teamId", 100] }, "$$team.winner"] } } } },
      team2win: { $anyElementTrue: { $map: { input: "$teams", as: "team", in: { $and: [{ $eq: ["$$team.teamId", 200] }, "$$team.winner"] } } } },
      event: "$timeline.frames.events"
    }
  },
  {
    $project: {
      _id: false,
      matchId: true,
      region: true,
      platformId: true,
      matchCreation: true,
      time: true,
      timestamp: "$event.timestamp",
      oneMinuteInterval: true,
      fiveMinuteInterval: true,
      eventType: "$event.eventType",
      participantId: "$event.participantId",
      participantWin: {
        $or: [
          { $and: [{ $eq: ["$event.participantId", 1] }, "$p1win"] },
          { $and: [{ $eq: ["$event.participantId", 2] }, "$p2win"] },
          { $and: [{ $eq: ["$event.participantId", 3] }, "$p3win"] },
          { $and: [{ $eq: ["$event.participantId", 4] }, "$p4win"] },
          { $and: [{ $eq: ["$event.participantId", 5] }, "$p5win"] },
          { $and: [{ $eq: ["$event.participantId", 6] }, "$p6win"] },
          { $and: [{ $eq: ["$event.participantId", 7] }, "$p7win"] },
          { $and: [{ $eq: ["$event.participantId", 8] }, "$p8win"] },
          { $and: [{ $eq: ["$event.participantId", 9] }, "$p9win"] },
          { $and: [{ $eq: ["$event.participantId", 10] }, "$p10win"] },
        ]
      },
      creatorId: "$event.creatorId",
      creatorWin: {
        $or: [
          { $and: [{ $eq: ["$event.creatorId", 1] }, "$p1win"] },
          { $and: [{ $eq: ["$event.creatorId", 2] }, "$p2win"] },
          { $and: [{ $eq: ["$event.creatorId", 3] }, "$p3win"] },
          { $and: [{ $eq: ["$event.creatorId", 4] }, "$p4win"] },
          { $and: [{ $eq: ["$event.creatorId", 5] }, "$p5win"] },
          { $and: [{ $eq: ["$event.creatorId", 6] }, "$p6win"] },
          { $and: [{ $eq: ["$event.creatorId", 7] }, "$p7win"] },
          { $and: [{ $eq: ["$event.creatorId", 8] }, "$p8win"] },
          { $and: [{ $eq: ["$event.creatorId", 9] }, "$p9win"] },
          { $and: [{ $eq: ["$event.creatorId", 10] }, "$p10win"] },
        ]
      },
      killerId: "$event.killerId",
      killerWin: {
        $or: [
          { $and: [{ $eq: ["$event.killerId", 1] }, "$p1win"] },
          { $and: [{ $eq: ["$event.killerId", 2] }, "$p2win"] },
          { $and: [{ $eq: ["$event.killerId", 3] }, "$p3win"] },
          { $and: [{ $eq: ["$event.killerId", 4] }, "$p4win"] },
          { $and: [{ $eq: ["$event.killerId", 5] }, "$p5win"] },
          { $and: [{ $eq: ["$event.killerId", 6] }, "$p6win"] },
          { $and: [{ $eq: ["$event.killerId", 7] }, "$p7win"] },
          { $and: [{ $eq: ["$event.killerId", 8] }, "$p8win"] },
          { $and: [{ $eq: ["$event.killerId", 9] }, "$p9win"] },
          { $and: [{ $eq: ["$event.killerId", 10] }, "$p10win"] },
        ]
      },
      victimId: "$event.victimId",
      victimWin: {
        $or: [
          { $and: [{ $eq: ["$event.victimId", 1] }, "$p1win"] },
          { $and: [{ $eq: ["$event.victimId", 2] }, "$p2win"] },
          { $and: [{ $eq: ["$event.victimId", 3] }, "$p3win"] },
          { $and: [{ $eq: ["$event.victimId", 4] }, "$p4win"] },
          { $and: [{ $eq: ["$event.victimId", 5] }, "$p5win"] },
          { $and: [{ $eq: ["$event.victimId", 6] }, "$p6win"] },
          { $and: [{ $eq: ["$event.victimId", 7] }, "$p7win"] },
          { $and: [{ $eq: ["$event.victimId", 8] }, "$p8win"] },
          { $and: [{ $eq: ["$event.victimId", 9] }, "$p9win"] },
          { $and: [{ $eq: ["$event.victimId", 10] }, "$p10win"] },
        ]
      },
      teamId: "$event.teamId",
      teamWin: {
        $or: [
          { $and: [{ $eq: ["$event.teamId", 100] }, "$team1win"] },
          { $and: [{ $eq: ["$event.teamId", 200] }, "$team2win"] }
        ]
      },
      skillSlot: "$event.skillSlot",
      levelUpType: "$event.levelUpType",
      monsterType: "$event.monsterType",
      itemId: "$event.itemId",
      itemBefore: "$event.itemBefore",
      itemAfter: "$event.itemAfter",
      wardType: "$event.wardType",
      assistingParticipantIds: "$event.assistingParticipantIds",
      position: "$event.position",
      laneType: "$event.laneType",
      buildingType: "$event.buildingType",
      towerType: "$event.towerType"
    }
  },
  {
    $out: "MatchEvents"
  }
);

// Generate indices to assist performing queries.
db.MatchEvents.createIndex({ matchId: 1 });
db.MatchEvents.createIndex({ region: 1 });
db.MatchEvents.createIndex({ matchCreation: 1 });
db.MatchEvents.createIndex({ time: 1 });
db.MatchEvents.createIndex({ eventType: 1 });
db.MatchEvents.createIndex({ itemId: 1 });