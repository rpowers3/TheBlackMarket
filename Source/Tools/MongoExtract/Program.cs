using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using CommandLine;
using CommandLine.Text;
using MongoDB;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace MongoExtract {
	public class Program {
		#region Methods

		public void Main(string[] args) {
			var sets = new string[] {
				//@"-d TheBlackMarket -c BrawlerGroupsG -o G:\Projects\TheBlackMarket\Data\Json\BrawlerGroupsG -i _id.global -f {0}",
				//@"-d TheBlackMarket -c BrawlerGroupsR -o G:\Projects\TheBlackMarket\Data\Json\BrawlerGroupsR -i _id.region -f r{0}",
				//@"-d TheBlackMarket -c BrawlerGroupsRT -o G:\Projects\TheBlackMarket\Data\Json\BrawlerGroupsRT -i _id.region,_id.teamId -f r{0}t{1}",
				//@"-d TheBlackMarket -c BrawlerGroupsT -o G:\Projects\TheBlackMarket\Data\Json\BrawlerGroupsT -i _id.teamId -f t{0}",
				//@"-d TheBlackMarket -c BuildingKillC -o G:\Projects\TheBlackMarket\Data\Json\BuildingKillC -i _id.championId -f c{0}",
				//@"-d TheBlackMarket -c BuildingKillG -o G:\Projects\TheBlackMarket\Data\Json\BuildingKillG -i _id.global -f {0}",
				//@"-d TheBlackMarket -c BuildingKillR -o G:\Projects\TheBlackMarket\Data\Json\BuildingKillR -i _id.region -f r{0}",
				//@"-d TheBlackMarket -c BuildingKillRC -o G:\Projects\TheBlackMarket\Data\Json\BuildingKillRC -i _id.region,_id.championId -f r{0}c{1}",
				//@"-d TheBlackMarket -c BuildingKillRT -o G:\Projects\TheBlackMarket\Data\Json\BuildingKillRT -i _id.region,_id.teamId -f r{0}t{1}",
				//@"-d TheBlackMarket -c BuildingKillRTC -o G:\Projects\TheBlackMarket\Data\Json\BuildingKillRTC -i _id.region,_id.teamId,_id.championId -f r{0}t{1}c{2}",
				//@"-d TheBlackMarket -c BuildingKillT -o G:\Projects\TheBlackMarket\Data\Json\BuildingKillT -i _id.teamId -f t{0}",
				//@"-d TheBlackMarket -c BuildingKillTC -o G:\Projects\TheBlackMarket\Data\Json\BuildingKillTC -i _id.teamId,_id.championId -f t{0}c{1}",
				//@"-d TheBlackMarket -c BuildingPerMinuteKillC -o G:\Projects\TheBlackMarket\Data\Json\BuildingPerMinuteKillC -i _id.championId -f c{0}",
				//@"-d TheBlackMarket -c BuildingPerMinuteKillG -o G:\Projects\TheBlackMarket\Data\Json\BuildingPerMinuteKillG -i _id.global -f {0}",
				//@"-d TheBlackMarket -c BuildingPerMinuteKillR -o G:\Projects\TheBlackMarket\Data\Json\BuildingPerMinuteKillR -i _id.region -f r{0}",
				//@"-d TheBlackMarket -c BuildingPerMinuteKillRC -o G:\Projects\TheBlackMarket\Data\Json\BuildingPerMinuteKillRC -i _id.region,_id.championId -f r{0}c{1}",
				//@"-d TheBlackMarket -c BuildingPerMinuteKillRT -o G:\Projects\TheBlackMarket\Data\Json\BuildingPerMinuteKillRT -i _id.region,_id.teamId -f r{0}t{1}",
				//@"-d TheBlackMarket -c BuildingPerMinuteKillRTC -o G:\Projects\TheBlackMarket\Data\Json\BuildingPerMinuteKillRTC -i _id.region,_id.teamId,_id.championId -f r{0}t{1}c{2}",
				//@"-d TheBlackMarket -c BuildingPerMinuteKillT -o G:\Projects\TheBlackMarket\Data\Json\BuildingPerMinuteKillT -i _id.teamId -f t{0}",
				//@"-d TheBlackMarket -c BuildingPerMinuteKillTC -o G:\Projects\TheBlackMarket\Data\Json\BuildingPerMinuteKillTC -i _id.teamId,_id.championId -f t{0}c{1}",
				//@"-d TheBlackMarket -c ChampionPerMinuteSkillLevelUpC -o G:\Projects\TheBlackMarket\Data\Json\ChampionPerMinuteSkillLevelUpC -i _id.championId -f c{0}",
				//@"-d TheBlackMarket -c ChampionPerMinuteSkillLevelUpG -o G:\Projects\TheBlackMarket\Data\Json\ChampionPerMinuteSkillLevelUpG -i _id.global -f {0}",
				//@"-d TheBlackMarket -c ChampionPerMinuteSkillLevelUpR -o G:\Projects\TheBlackMarket\Data\Json\ChampionPerMinuteSkillLevelUpR -i _id.region -f r{0}",
				//@"-d TheBlackMarket -c ChampionPerMinuteSkillLevelUpRC -o G:\Projects\TheBlackMarket\Data\Json\ChampionPerMinuteSkillLevelUpRC -i _id.region,_id.championId -f r{0}c{1}",
				//@"-d TheBlackMarket -c ChampionPerMinuteSkillLevelUpRT -o G:\Projects\TheBlackMarket\Data\Json\ChampionPerMinuteSkillLevelUpRT -i _id.region,_id.teamId -f r{0}t{1}",
				//@"-d TheBlackMarket -c ChampionPerMinuteSkillLevelUpRTC -o G:\Projects\TheBlackMarket\Data\Json\ChampionPerMinuteSkillLevelUpRTC -i _id.region,_id.teamId,_id.championId -f r{0}t{1}c{2}",
				//@"-d TheBlackMarket -c ChampionPerMinuteSkillLevelUpT -o G:\Projects\TheBlackMarket\Data\Json\ChampionPerMinuteSkillLevelUpT -i _id.teamId -f t{0}",
				//@"-d TheBlackMarket -c ChampionPerMinuteSkillLevelUpTC -o G:\Projects\TheBlackMarket\Data\Json\ChampionPerMinuteSkillLevelUpTC -i _id.teamId,_id.championId -f t{0}c{1}",
				//@"-d TheBlackMarket -c ChampionStatsC -o G:\Projects\TheBlackMarket\Data\Json\ChampionStatsC -i _id.championId -f c{0}",
				//@"-d TheBlackMarket -c ChampionStatsG -o G:\Projects\TheBlackMarket\Data\Json\ChampionStatsG -i _id.global -f {0}",
				//@"-d TheBlackMarket -c ChampionStatsR -o G:\Projects\TheBlackMarket\Data\Json\ChampionStatsR -i _id.region -f r{0}",
				//@"-d TheBlackMarket -c ChampionStatsRC -o G:\Projects\TheBlackMarket\Data\Json\ChampionStatsRC -i _id.region,_id.championId -f r{0}c{1}",
				//@"-d TheBlackMarket -c ChampionStatsRT -o G:\Projects\TheBlackMarket\Data\Json\ChampionStatsRT -i _id.region,_id.teamId -f r{0}t{1}",
				//@"-d TheBlackMarket -c ChampionStatsRTC -o G:\Projects\TheBlackMarket\Data\Json\ChampionStatsRTC -i _id.region,_id.teamId,_id.championId -f r{0}t{1}c{2}",
				//@"-d TheBlackMarket -c ChampionStatsT -o G:\Projects\TheBlackMarket\Data\Json\ChampionStatsT -i _id.teamId -f t{0}",
				//@"-d TheBlackMarket -c ChampionStatsTC -o G:\Projects\TheBlackMarket\Data\Json\ChampionStatsTC -i _id.teamId,_id.championId -f t{0}c{1}",
				//@"-d TheBlackMarket -c ChampionStatsOverTimeC -o G:\Projects\TheBlackMarket\Data\Json\ChampionStatsOverTimeC -i _id.championId -f c{0}",
				//@"-d TheBlackMarket -c ChampionStatsOverTimeG -o G:\Projects\TheBlackMarket\Data\Json\ChampionStatsOverTimeG -i _id.global -f {0}",
				//@"-d TheBlackMarket -c ChampionStatsOverTimeR -o G:\Projects\TheBlackMarket\Data\Json\ChampionStatsOverTimeR -i _id.region -f r{0}",
				//@"-d TheBlackMarket -c ChampionStatsOverTimeRC -o G:\Projects\TheBlackMarket\Data\Json\ChampionStatsOverTimeRC -i _id.region,_id.championId -f r{0}c{1}",
				//@"-d TheBlackMarket -c ChampionStatsOverTimeRT -o G:\Projects\TheBlackMarket\Data\Json\ChampionStatsOverTimeRT -i _id.region,_id.teamId -f r{0}t{1}",
				//@"-d TheBlackMarket -c ChampionStatsOverTimeRTC -o G:\Projects\TheBlackMarket\Data\Json\ChampionStatsOverTimeRTC -i _id.region,_id.teamId,_id.championId -f r{0}t{1}c{2}",
				//@"-d TheBlackMarket -c ChampionStatsOverTimeT -o G:\Projects\TheBlackMarket\Data\Json\ChampionStatsOverTimeT -i _id.teamId -f t{0}",
				//@"-d TheBlackMarket -c ChampionStatsOverTimeTC -o G:\Projects\TheBlackMarket\Data\Json\ChampionStatsOverTimeTC -i _id.teamId,_id.championId -f t{0}c{1}",
				//@"-d TheBlackMarket -c EliteMonsterKillC -o G:\Projects\TheBlackMarket\Data\Json\EliteMonsterKillC -i _id.championId -f c{0}",
				//@"-d TheBlackMarket -c EliteMonsterKillG -o G:\Projects\TheBlackMarket\Data\Json\EliteMonsterKillG -i _id.global -f {0}",
				//@"-d TheBlackMarket -c EliteMonsterKillR -o G:\Projects\TheBlackMarket\Data\Json\EliteMonsterKillR -i _id.region -f r{0}",
				//@"-d TheBlackMarket -c EliteMonsterKillRC -o G:\Projects\TheBlackMarket\Data\Json\EliteMonsterKillRC -i _id.region,_id.championId -f r{0}c{1}",
				//@"-d TheBlackMarket -c EliteMonsterKillRT -o G:\Projects\TheBlackMarket\Data\Json\EliteMonsterKillRT -i _id.region,_id.teamId -f r{0}t{1}",
				//@"-d TheBlackMarket -c EliteMonsterKillRTC -o G:\Projects\TheBlackMarket\Data\Json\EliteMonsterKillRTC -i _id.region,_id.teamId,_id.championId -f r{0}t{1}c{2}",
				//@"-d TheBlackMarket -c EliteMonsterKillT -o G:\Projects\TheBlackMarket\Data\Json\EliteMonsterKillT -i _id.teamId -f t{0}",
				//@"-d TheBlackMarket -c EliteMonsterKillTC -o G:\Projects\TheBlackMarket\Data\Json\EliteMonsterKillTC -i _id.teamId,_id.championId -f t{0}c{1}",

				@"-d TheBlackMarket -c EliteMonsterPerMinuteKillC -o G:\Projects\TheBlackMarket\Data\Json\EliteMonsterPerMinuteKillC -i _id.championId -f c{0}",
				@"-d TheBlackMarket -c EliteMonsterPerMinuteKillG -o G:\Projects\TheBlackMarket\Data\Json\EliteMonsterPerMinuteKillG -i _id.global -f {0}",
				@"-d TheBlackMarket -c EliteMonsterPerMinuteKillR -o G:\Projects\TheBlackMarket\Data\Json\EliteMonsterPerMinuteKillR -i _id.region -f r{0}",
				@"-d TheBlackMarket -c EliteMonsterPerMinuteKillRC -o G:\Projects\TheBlackMarket\Data\Json\EliteMonsterPerMinuteKillRC -i _id.region,_id.championId -f r{0}c{1}",
				@"-d TheBlackMarket -c EliteMonsterPerMinuteKillRT -o G:\Projects\TheBlackMarket\Data\Json\EliteMonsterPerMinuteKillRT -i _id.region,_id.teamId -f r{0}t{1}",
				@"-d TheBlackMarket -c EliteMonsterPerMinuteKillRTC -o G:\Projects\TheBlackMarket\Data\Json\EliteMonsterPerMinuteKillRTC -i _id.region,_id.teamId,_id.championId -f r{0}t{1}c{2}",
				@"-d TheBlackMarket -c EliteMonsterPerMinuteKillT -o G:\Projects\TheBlackMarket\Data\Json\EliteMonsterPerMinuteKillT -i _id.teamId -f t{0}",
				@"-d TheBlackMarket -c EliteMonsterPerMinuteKillTC -o G:\Projects\TheBlackMarket\Data\Json\EliteMonsterPerMinuteKillTC -i _id.teamId,_id.championId -f t{0}c{1}",


				//@"-d TheBlackMarket -c ItemPerMinuteWinRatesCI -o G:\Projects\TheBlackMarket\Data\Json\ItemPerMinuteWinRatesCI -i _id.championId,_id.itemId -f c{0}i{1}",
				//@"-d TheBlackMarket -c ItemPerMinuteWinRatesI -o G:\Projects\TheBlackMarket\Data\Json\ItemPerMinuteWinRatesI -i _id.itemId -f i{0}",
				//@"-d TheBlackMarket -c ItemPerMinuteWinRatesRCI -o G:\Projects\TheBlackMarket\Data\Json\ItemPerMinuteWinRatesRCI -i _id.region,_id.championId,_id.itemId -f r{0}c{1}i{2}",
				//@"-d TheBlackMarket -c ItemPerMinuteWinRatesRI -o G:\Projects\TheBlackMarket\Data\Json\ItemPerMinuteWinRatesRI -i _id.region,_id.itemId -f r{0}i{1}",
				//@"-d TheBlackMarket -c ItemPerMinuteWinRatesRTCI -o G:\Projects\TheBlackMarket\Data\Json\ItemPerMinuteWinRatesRTCI -i _id.region,_id.teamId,_id.championId,_id.itemId -f r{0}t{1}c{2}i{3}",
				//@"-d TheBlackMarket -c ItemPerMinuteWinRatesRTI -o G:\Projects\TheBlackMarket\Data\Json\ItemPerMinuteWinRatesRTI -i _id.region,_id.teamId,_id.itemId -f r{0}t{1}i{2}",
				//@"-d TheBlackMarket -c ItemPerMinuteWinRatesTCI -o G:\Projects\TheBlackMarket\Data\Json\ItemPerMinuteWinRatesTCI -i _id.teamId,_id.championId,_id.itemId -f t{0}c{1}i{2}",
				//@"-d TheBlackMarket -c ItemPerMinuteWinRatesTI -o G:\Projects\TheBlackMarket\Data\Json\ItemPerMinuteWinRatesTI -i _id.teamId,_id.itemId -f t{0}i{1}",
				//@"-d TheBlackMarket -c ItemWinRatesC -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesC -i _id.championId -f c{0}",
				//@"-d TheBlackMarket -c ItemWinRatesCI -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesCI -i _id.championId,_id.itemId -f c{0}i{1}",
				//@"-d TheBlackMarket -c ItemWinRatesG -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesG -i _id.global -f {0}",
				//@"-d TheBlackMarket -c ItemWinRatesI -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesI -i _id.itemId -f i{0}",
				//@"-d TheBlackMarket -c ItemWinRatesOverTimeCI -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesOverTimeCI -i _id.championId,_id.itemId -f c{0}i{1}",
				//@"-d TheBlackMarket -c ItemWinRatesOverTimeI -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesOverTimeI -i _id.itemId -f i{0}",
				//@"-d TheBlackMarket -c ItemWinRatesOverTimeRCI -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesOverTimeRCI -i _id.region,_id.championId,_id.itemId -f r{0}c{1}i{2}",
				//@"-d TheBlackMarket -c ItemWinRatesOverTimeRI -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesOverTimeRI -i _id.region,_id.itemId -f r{0}i{1}",
				//@"-d TheBlackMarket -c ItemWinRatesOverTimeRTCI -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesOverTimeRTCI -i _id.region,_id.teamId,_id.championId,_id.itemId -f r{0}t{1}c{2}i{3}",
				//@"-d TheBlackMarket -c ItemWinRatesOverTimeRTI -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesOverTimeRTI -i _id.region,_id.teamId,_id.itemId -f r{0}t{1}i{2}",
				//@"-d TheBlackMarket -c ItemWinRatesOverTimeTCI -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesOverTimeTCI -i _id.teamId,_id.championId,_id.itemId -f t{0}c{1}i{2}",
				//@"-d TheBlackMarket -c ItemWinRatesOverTimeTI -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesOverTimeTI -i _id.teamId,_id.itemId -f t{0}i{1}",
				//@"-d TheBlackMarket -c ItemWinRatesR -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesR -i _id.region -f r{0}",
				//@"-d TheBlackMarket -c ItemWinRatesRC -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesRC -i _id.region,_id.championId -f r{0}c{1}",
				//@"-d TheBlackMarket -c ItemWinRatesRCI -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesRCI -i _id.region,_id.championId,_id.itemId -f r{0}c{1}i{2}",
				//@"-d TheBlackMarket -c ItemWinRatesRI -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesRI -i _id.region,_id.itemId -f r{0}i{1}",
				//@"-d TheBlackMarket -c ItemWinRatesRT -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesRT -i _id.region,_id.teamId -f r{0}t{1}",
				//@"-d TheBlackMarket -c ItemWinRatesRTC -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesRTC -i _id.region,_id.teamId,_id.championId -f r{0}t{1}c{2}",
				//@"-d TheBlackMarket -c ItemWinRatesRTCI -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesRTCI -i _id.region,_id.teamId,_id.championId,_id.itemId -f r{0}t{1}c{2}i{3}",
				//@"-d TheBlackMarket -c ItemWinRatesRTI -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesRTI -i _id.region,_id.teamId,_id.itemId -f r{0}t{1}i{2}",
				//@"-d TheBlackMarket -c ItemWinRatesT -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesT -i _id.teamId -f t{0}",
				//@"-d TheBlackMarket -c ItemWinRatesTC -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesTC -i _id.teamId,_id.championId -f t{0}c{1}",
				//@"-d TheBlackMarket -c ItemWinRatesTCI -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesTCI -i _id.teamId,_id.championId,_id.itemId -f t{0}c{1}i{2}",
				//@"-d TheBlackMarket -c ItemWinRatesTI -o G:\Projects\TheBlackMarket\Data\Json\ItemWinRatesTI -i _id.teamId,_id.itemId -f t{0}i{1}",
				//@"-d TheBlackMarket -c DeathLocationsC -o G:\Projects\TheBlackMarket\Data\Json\DeathLocationsC -i _id.championId -f c{0}",
				//@"-d TheBlackMarket -c DeathLocationsG -o G:\Projects\TheBlackMarket\Data\Json\DeathLocationsG -i _id.global -f {0}",
				//@"-d TheBlackMarket -c DeathLocationsR -o G:\Projects\TheBlackMarket\Data\Json\DeathLocationsR -i _id.region -f r{0}",
				//@"-d TheBlackMarket -c DeathLocationsRC -o G:\Projects\TheBlackMarket\Data\Json\DeathLocationsRC -i _id.region,_id.championId -f r{0}c{1}",
				//@"-d TheBlackMarket -c DeathLocationsRT -o G:\Projects\TheBlackMarket\Data\Json\DeathLocationsRT -i _id.region,_id.teamId -f r{0}t{1}",
				//@"-d TheBlackMarket -c DeathLocationsRTC -o G:\Projects\TheBlackMarket\Data\Json\DeathLocationsRTC -i _id.region,_id.teamId,_id.championId -f r{0}t{1}c{2}",
				//@"-d TheBlackMarket -c DeathLocationsT -o G:\Projects\TheBlackMarket\Data\Json\DeathLocationsT -i _id.teamId -f t{0}",
				//@"-d TheBlackMarket -c DeathLocationsTC -o G:\Projects\TheBlackMarket\Data\Json\DeathLocationsTC -i _id.teamId,_id.championId -f t{0}c{1}",
				//@"-d TheBlackMarket -c KillLocationsC -o G:\Projects\TheBlackMarket\Data\Json\KillLocationsC -i _id.championId -f c{0}",
				//@"-d TheBlackMarket -c KillLocationsG -o G:\Projects\TheBlackMarket\Data\Json\KillLocationsG -i _id.global -f {0}",
				//@"-d TheBlackMarket -c KillLocationsR -o G:\Projects\TheBlackMarket\Data\Json\KillLocationsR -i _id.region -f r{0}",
				//@"-d TheBlackMarket -c KillLocationsRC -o G:\Projects\TheBlackMarket\Data\Json\KillLocationsRC -i _id.region,_id.championId -f r{0}c{1}",
				//@"-d TheBlackMarket -c KillLocationsRT -o G:\Projects\TheBlackMarket\Data\Json\KillLocationsRT -i _id.region,_id.teamId -f r{0}t{1}",
				//@"-d TheBlackMarket -c KillLocationsRTC -o G:\Projects\TheBlackMarket\Data\Json\KillLocationsRTC -i _id.region,_id.teamId,_id.championId -f r{0}t{1}c{2}",
				//@"-d TheBlackMarket -c KillLocationsT -o G:\Projects\TheBlackMarket\Data\Json\KillLocationsT -i _id.teamId -f t{0}",
				//@"-d TheBlackMarket -c KillLocationsTC -o G:\Projects\TheBlackMarket\Data\Json\KillLocationsTC -i _id.teamId,_id.championId -f t{0}c{1}",
				//@"-d TheBlackMarket -c NemesisStatsC -o G:\Projects\TheBlackMarket\Data\Json\NemesisStatsC -i _id.championId -f c{0}",
				//@"-d TheBlackMarket -c NemesisStatsR -o G:\Projects\TheBlackMarket\Data\Json\NemesisStatsR -i _id.region -f r{0}",
				//@"-d TheBlackMarket -c NemesisStatsRC -o G:\Projects\TheBlackMarket\Data\Json\NemesisStatsRC -i _id.region,_id.championId -f r{0}c{1}",
				//@"-d TheBlackMarket -c NemesisStatsRT -o G:\Projects\TheBlackMarket\Data\Json\NemesisStatsRT -i _id.region,_id.teamId -f r{0}t{1}",
				//@"-d TheBlackMarket -c NemesisStatsRTC -o G:\Projects\TheBlackMarket\Data\Json\NemesisStatsRTC -i _id.region,_id.teamId,_id.championId -f r{0}t{1}c{2}",
				//@"-d TheBlackMarket -c NemesisStatsT -o G:\Projects\TheBlackMarket\Data\Json\NemesisStatsT -i _id.teamId -f t{0}",
				//@"-d TheBlackMarket -c NemesisStatsTC -o G:\Projects\TheBlackMarket\Data\Json\NemesisStatsTC -i _id.teamId,_id.championId -f t{0}c{1}",
				//@"-d TheBlackMarket -c VictimStatsC -o G:\Projects\TheBlackMarket\Data\Json\VictimStatsC -i _id.championId -f c{0}",
				//@"-d TheBlackMarket -c VictimStatsR -o G:\Projects\TheBlackMarket\Data\Json\VictimStatsR -i _id.region -f r{0}",
				//@"-d TheBlackMarket -c VictimStatsRC -o G:\Projects\TheBlackMarket\Data\Json\VictimStatsRC -i _id.region,_id.championId -f r{0}c{1}",
				//@"-d TheBlackMarket -c VictimStatsRT -o G:\Projects\TheBlackMarket\Data\Json\VictimStatsRT -i _id.region,_id.teamId -f r{0}t{1}",
				//@"-d TheBlackMarket -c VictimStatsRTC -o G:\Projects\TheBlackMarket\Data\Json\VictimStatsRTC -i _id.region,_id.teamId,_id.championId -f r{0}t{1}c{2}",
				//@"-d TheBlackMarket -c VictimStatsT -o G:\Projects\TheBlackMarket\Data\Json\VictimStatsT -i _id.teamId -f t{0}",
				//@"-d TheBlackMarket -c VictimStatsTC -o G:\Projects\TheBlackMarket\Data\Json\VictimStatsTC -i _id.teamId,_id.championId -f t{0}c{1}",
				//@"-d TheBlackMarket -c SummonerMasteriesUseC -o G:\Projects\TheBlackMarket\Data\Json\SummonerMasteriesUseC -i _id.championId -f c{0}",
				//@"-d TheBlackMarket -c SummonerMasteriesUseG -o G:\Projects\TheBlackMarket\Data\Json\SummonerMasteriesUseG -i _id.global -f {0}",
				//@"-d TheBlackMarket -c SummonerMasteriesUseR -o G:\Projects\TheBlackMarket\Data\Json\SummonerMasteriesUseR -i _id.region -f r{0}",
				//@"-d TheBlackMarket -c SummonerMasteriesUseRC -o G:\Projects\TheBlackMarket\Data\Json\SummonerMasteriesUseRC -i _id.region,_id.championId -f r{0}c{1}",
				//@"-d TheBlackMarket -c SummonerMasteriesUseRT -o G:\Projects\TheBlackMarket\Data\Json\SummonerMasteriesUseRT -i _id.region,_id.teamId -f r{0}t{1}",
				//@"-d TheBlackMarket -c SummonerMasteriesUseRTC -o G:\Projects\TheBlackMarket\Data\Json\SummonerMasteriesUseRTC -i _id.region,_id.teamId,_id.championId -f r{0}t{1}c{2}",
				//@"-d TheBlackMarket -c SummonerMasteriesUseT -o G:\Projects\TheBlackMarket\Data\Json\SummonerMasteriesUseT -i _id.teamId -f t{0}",
				//@"-d TheBlackMarket -c SummonerMasteriesUseTC -o G:\Projects\TheBlackMarket\Data\Json\SummonerMasteriesUseTC -i _id.teamId,_id.championId -f t{0}c{1}",
				//@"-d TheBlackMarket -c SummonerRuneUseC -o G:\Projects\TheBlackMarket\Data\Json\SummonerRuneUseC -i _id.championId -f c{0}",
				//@"-d TheBlackMarket -c SummonerRuneUseG -o G:\Projects\TheBlackMarket\Data\Json\SummonerRuneUseG -i _id.global -f {0}",
				//@"-d TheBlackMarket -c SummonerRuneUseR -o G:\Projects\TheBlackMarket\Data\Json\SummonerRuneUseR -i _id.region -f r{0}",
				//@"-d TheBlackMarket -c SummonerRuneUseRC -o G:\Projects\TheBlackMarket\Data\Json\SummonerRuneUseRC -i _id.region,_id.championId -f r{0}c{1}",
				//@"-d TheBlackMarket -c SummonerRuneUseRT -o G:\Projects\TheBlackMarket\Data\Json\SummonerRuneUseRT -i _id.region,_id.teamId -f r{0}t{1}",
				//@"-d TheBlackMarket -c SummonerRuneUseRTC -o G:\Projects\TheBlackMarket\Data\Json\SummonerRuneUseRTC -i _id.region,_id.teamId,_id.championId -f r{0}t{1}c{2}",
				//@"-d TheBlackMarket -c SummonerRuneUseT -o G:\Projects\TheBlackMarket\Data\Json\SummonerRuneUseT -i _id.teamId -f t{0}",
				//@"-d TheBlackMarket -c SummonerRuneUseTC -o G:\Projects\TheBlackMarket\Data\Json\SummonerRuneUseTC -i _id.teamId,_id.championId -f t{0}c{1}",
				//@"-d TheBlackMarket -c SummonerSpellUseC -o G:\Projects\TheBlackMarket\Data\Json\SummonerSpellUseC -i _id.championId -f c{0}",
				//@"-d TheBlackMarket -c SummonerSpellUseG -o G:\Projects\TheBlackMarket\Data\Json\SummonerSpellUseG -i _id.global -f {0}",
				//@"-d TheBlackMarket -c SummonerSpellUseR -o G:\Projects\TheBlackMarket\Data\Json\SummonerSpellUseR -i _id.region -f r{0}",
				//@"-d TheBlackMarket -c SummonerSpellUseRC -o G:\Projects\TheBlackMarket\Data\Json\SummonerSpellUseRC -i _id.region,_id.championId -f r{0}c{1}",
				//@"-d TheBlackMarket -c SummonerSpellUseRT -o G:\Projects\TheBlackMarket\Data\Json\SummonerSpellUseRT -i _id.region,_id.teamId -f r{0}t{1}",
				//@"-d TheBlackMarket -c SummonerSpellUseRTC -o G:\Projects\TheBlackMarket\Data\Json\SummonerSpellUseRTC -i _id.region,_id.teamId,_id.championId -f r{0}t{1}c{2}",
				//@"-d TheBlackMarket -c SummonerSpellUseT -o G:\Projects\TheBlackMarket\Data\Json\SummonerSpellUseT -i _id.teamId -f t{0}",
				//@"-d TheBlackMarket -c SummonerSpellUseTC -o G:\Projects\TheBlackMarket\Data\Json\SummonerSpellUseTC -i _id.teamId,_id.championId -f t{0}c{1}",
				//@"-d TheBlackMarket -c WardKillsC -o G:\Projects\TheBlackMarket\Data\Json\WardKillsC -i _id.championId -f c{0}",
				//@"-d TheBlackMarket -c WardKillsG -o G:\Projects\TheBlackMarket\Data\Json\WardKillsG -i _id.global -f {0}",
				//@"-d TheBlackMarket -c WardKillsR -o G:\Projects\TheBlackMarket\Data\Json\WardKillsR -i _id.region -f r{0}",
				//@"-d TheBlackMarket -c WardKillsRC -o G:\Projects\TheBlackMarket\Data\Json\WardKillsRC -i _id.region,_id.championId -f r{0}c{1}",
				//@"-d TheBlackMarket -c WardKillsRT -o G:\Projects\TheBlackMarket\Data\Json\WardKillsRT -i _id.region,_id.teamId -f r{0}t{1}",
				//@"-d TheBlackMarket -c WardKillsRTC -o G:\Projects\TheBlackMarket\Data\Json\WardKillsRTC -i _id.region,_id.teamId,_id.championId -f r{0}t{1}c{2}",
				//@"-d TheBlackMarket -c WardKillsT -o G:\Projects\TheBlackMarket\Data\Json\WardKillsT -i _id.teamId -f t{0}",
				//@"-d TheBlackMarket -c WardKillsTC -o G:\Projects\TheBlackMarket\Data\Json\WardKillsTC -i _id.teamId,_id.championId -f t{0}c{1}",
				//@"-d TheBlackMarket -c WardPlacementC -o G:\Projects\TheBlackMarket\Data\Json\WardPlacementC -i _id.championId -f c{0}",
				//@"-d TheBlackMarket -c WardPlacementG -o G:\Projects\TheBlackMarket\Data\Json\WardPlacementG -i _id.global -f {0}",
				//@"-d TheBlackMarket -c WardPlacementR -o G:\Projects\TheBlackMarket\Data\Json\WardPlacementR -i _id.region -f r{0}",
				//@"-d TheBlackMarket -c WardPlacementRC -o G:\Projects\TheBlackMarket\Data\Json\WardPlacementRC -i _id.region,_id.championId -f r{0}c{1}",
				//@"-d TheBlackMarket -c WardPlacementRT -o G:\Projects\TheBlackMarket\Data\Json\WardPlacementRT -i _id.region,_id.teamId -f r{0}t{1}",
				//@"-d TheBlackMarket -c WardPlacementRTC -o G:\Projects\TheBlackMarket\Data\Json\WardPlacementRTC -i _id.region,_id.teamId,_id.championId -f r{0}t{1}c{2}",
				//@"-d TheBlackMarket -c WardPlacementT -o G:\Projects\TheBlackMarket\Data\Json\WardPlacementT -i _id.teamId -f t{0}",
				//@"-d TheBlackMarket -c WardPlacementTC -o G:\Projects\TheBlackMarket\Data\Json\WardPlacementTC -i _id.teamId,_id.championId -f t{0}c{1}"
			};

			foreach (var set in sets) {
				var setArgs = set.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

				try {
					Batch(setArgs);
				} catch (Exception e) {
					Console.WriteLine("Failed to process {0}:\n\n{1}\n", args[3], e);
				}
			}
		}

		public void Batch(string[] args) {
			var parserResults = Parser.Default.ParseArguments<Options>(args);

			if (parserResults.Tag == ParserResultType.NotParsed) {
				Console.WriteLine(
					new HelpText { AddDashesToOption = true }
						.AddPreOptionsLine("MongoExtract")
						.AddPreOptionsLine("")
						.AddOptions(parserResults).ToString());

				return;
			}

			var options = (parserResults as Parsed<Options>).Value;
			var idAccessors = options.IdPaths.Select(idPath => BuildIdAccesor(idPath)).ToList();

			var hasOutputDirectory = !string.IsNullOrWhiteSpace(options.OutputDirectory);

			try {
				if (hasOutputDirectory && !Directory.Exists(options.OutputDirectory)) {
					Directory.CreateDirectory(options.OutputDirectory);
				}

				var mongoClient = new MongoClient();
				var database = mongoClient.GetDatabase(options.Database);
				var collection = database.GetCollection<BsonDocument>(options.Collection);

				var jsonWriterSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };

				var jsonConverters = new JsonConverter[] {
					new FloatConverter() {
						Precission = options.Precission
					}
				};

				Console.WriteLine("Exporting collection {0}.{1}\n", options.Database, options.Collection);
				var documents = collection.Find(_ => true).ToListAsync().GetAwaiter().GetResult();

				foreach (var document in documents) {
					var jsonString = document.ToJson(jsonWriterSettings);
					var json = JToken.Parse(jsonString);
					var ids = idAccessors.Select(ida => ida(json)).ToArray();

					if (options.StripId) {
						var nodeToRemove = json.Children().OfType<JProperty>().Where(p => p.Name.Equals("_id")).FirstOrDefault();
						if (nodeToRemove != null) {
							nodeToRemove.Remove();
						}
					}

					jsonString = json.ToString(Formatting.None, jsonConverters);

					if (hasOutputDirectory) {
						var fileName = string.Format(options.IdFormat, ids);
						var outputPath = Path.Combine(options.OutputDirectory, fileName) + ".json";
						File.WriteAllText(outputPath, jsonString);

						Console.WriteLine("  Exported {0}", fileName);
					} else {
						Console.WriteLine(jsonString);
					}
				}
			} catch (Exception e) {
				Console.Error.WriteLine("Failed to export collection \"{0}\" from database \"{1}\":\n\n{2}\n\n", options.Collection, options.Database, e);
			}

			Console.WriteLine();
		}

		private Func<JToken, string> BuildIdAccesor(string idPath) {
			var parts = idPath.Split('.');

			return (JToken token) => {
				foreach (var peice in parts) {
					token = token[peice];
				}

				return token.ToString();
			};
		}

		#endregion

		#region FloatConverter Class

		private class FloatConverter : JsonConverter {
			public int Precission {
				get;
				set;
			}

			public override bool CanConvert(Type objectType) {
				return (typeof(float) == objectType) || (typeof(double) == objectType);
			}

			public override object ReadJson(Newtonsoft.Json.JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer) {
				throw new NotImplementedException();
			}

			public override void WriteJson(Newtonsoft.Json.JsonWriter writer, object value, JsonSerializer serializer) {
				if (value.GetType() == typeof(float)) {
					var roundedValue = Math.Round((float) value, Precission);
					var intValue = (int) roundedValue;

					if (intValue == roundedValue) {
						writer.WriteRawValue(intValue.ToString());
					} else {
						writer.WriteValue(roundedValue);
					}

					return;
				}

				if (value.GetType() == typeof(double)) {
					var roundedValue = Math.Round((double) value, Precission);
					var longValue = (long) roundedValue;

					if (longValue == roundedValue) {
						writer.WriteRawValue(longValue.ToString());
					} else {
						writer.WriteValue(roundedValue);
					}

					return;
				}
			}
		}

		#endregion
	}
}
