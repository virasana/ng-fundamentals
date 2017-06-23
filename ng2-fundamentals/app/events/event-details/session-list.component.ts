import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ISession } from '../shared/index'
import { AuthService } from '../../user/auth.service'
import { VoterService } from './voter.service'

@Component({
    selector: 'session-list',
    templateUrl: 'app/events/event-details/session-list.component.html'
})

export class SessionListComponent implements OnInit, OnChanges {
    
    constructor(private auth: AuthService, private voterService: VoterService) {  }

    @Input() sessions: ISession[];
    @Input() filterBy: string;
    @Input() sortBy: string;
    @Input() eventId: number;
    
    visibleSessions: ISession[] = [];

    ngOnInit() { }
    ngOnChanges() {
        if (this.sessions) {
            this.filterSessions(this.filterBy);
        }

        this.sortBy === 'name'
            ? this.visibleSessions.sort(sortByNameAsc)
            : this.visibleSessions.sort(sortByVoteAsc);
    }

    filterSessions(filter: string) {
        if (filter === 'all') {
            this.visibleSessions = this.sessions.slice(0);
        } else {
            this.visibleSessions = this.sessions.filter(s => {
                return s.level.toLocaleLowerCase() === filter
            })
        }
    } 

    userHasVoted(session: ISession){
        return this.voterService.userHasVoted(session, this.auth.currentUser.userName);
    }

    toggleVote(session: ISession){
        if(this.userHasVoted(session)){
               this.voterService.deleteVoter(this.eventId, session, this.auth.currentUser.userName) ;
        }
        else {
            this.voterService.addVoter(this.eventId, session, this.auth.currentUser.userName) ;
        }

        if(this.sortBy === 'votes'){
            this.visibleSessions.sort(sortByVoteAsc);
        }
    }
}

function sortByNameAsc(s1: ISession, s2: ISession){
    if(s1.name > s2.name) return 1;
    else if(s1.name === s2.name) return 0; 
    else return -1; 
}

function sortByVoteAsc(s1: ISession, s2: ISession){
    return s2.voters.length -s1.voters.length;
}