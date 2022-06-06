import { MatchEventDto } from "./match-event.dto"
import { MatchParticipantFrameDto } from "./match-participant-frame.dto"

export interface IParticipantFrames {
    [key: string]: MatchParticipantFrameDto
}
/**
 * Match timeline frame
 */
export class MatchTimeLineFrameDto {
    /**
     * Timestamp
     */
    timestamp: number
    /**
     * Participant frames
     */
    participantFrames: IParticipantFrames
    /**
     * Events
     */
    events: MatchEventDto[]
}
