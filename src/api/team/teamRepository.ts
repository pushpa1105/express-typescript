import { TeamDocument, TeamModel } from "./teamModel";
import { CreateTeamData } from "./teamSchema";

export class TeamRepository {
    async createTeam(teamData: CreateTeamData & {
        ownerId: string;
    }): Promise<TeamDocument | null> {
        return await TeamModel.insertOne(teamData) || null
    }

    async findByName(name: string): Promise<TeamDocument | null> {
        return await TeamModel.findOne({ name }) || null
    }
}