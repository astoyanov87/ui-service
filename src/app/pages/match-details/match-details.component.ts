import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface MatchScore {
  homePlayerFrames: number;
  homePlayerPointsInCurrentFrame: number;
  homePlayerCurrentBreak: number;
  awayPlayerFrames: number;
  awayPlayerPointsInCurrentFrame: number;
  awayPlayerCurrentBreak: number;
}

interface FrameScore {
  frame: number;
  player1Score: number;
  player2Score: number;
}

interface Match {
  matchID: string;
  name: string;
  tournamentName: string;
  status: 'live' | 'scheduled' | 'completed';
  round: string;
  homePlayerId: string;
  homePlayerScore: number;
  startDateTime: string;
  homePlayer: {
    playerID: string;
    firstName: string;
    surname: string;
    media: {
      profile: string;
    };
  };
  awayPlayerId: string;
  awayPlayerScore: number;
  awayPlayer: {
    playerID: string;
    firstName: string;
    surname: string;
    media: {
      profile: string;
    };
  };
}


@Component({
  selector: 'app-match-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-details.component.html',
  styleUrl: './match-details.component.css'
})
export class MatchDetailsComponent implements OnInit, OnDestroy {
  matchId: string = '';
  private eventSource: EventSource | null = null;

  homePlayer = {
    name: '',
    image: '',
    frames: 0,
    currentBreak: 0
  };

  awayPlayer = {
    name: '',
    image: '',
    frames: 0,
    currentBreak: 0
  };

  homeScore = 0;
  awayScore = 0;
  frameNumber = 1;

  frameScores: FrameScore[] = [];

  tournamentName: string = '';
  match: Match | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.matchId = this.route.snapshot.paramMap.get('id') || '';
    //fetch from API
    this.http.get<Match>('/api/v1/match/' + this.matchId ).subscribe({
      next: (match) => {
        this.match = match;
        this.tournamentName = this.match?.tournamentName || 'Snooker Tournament';
        this.homePlayer.name = this.match.homePlayer.firstName + ' ' + this.match.homePlayer.surname;
        this.homePlayer.image = this.match.homePlayer.media.profile;
        this.awayPlayer.name = this.match.awayPlayer.firstName + ' ' + this.match.awayPlayer.surname;
        this.awayPlayer.image = this.match.awayPlayer.media.profile;
        this.homeScore = this.match.homePlayerScore;
        this.awayScore = this.match.awayPlayerScore;
        // Optionally set frameScores if available from API
        // this.frameScores = ...
        console.log(this.match);
      },
      error: (error) => {
        console.error('Error fetching matches:', error);
        // Handle error, e.g., show user-friendly message 
      }
    });

    //sse
    this.connectToSSE();
  }

  ngOnDestroy(): void {
    this.disconnectSSE();
  }

  private connectToSSE(): void {
    this.eventSource = new EventSource('http://127.0.0.1:8888/events');

    this.eventSource.onmessage = (event) => {
      const data: MatchScore = JSON.parse(event.data);
      this.updateScores(data);
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
    };
  }

  private disconnectSSE(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  private updateScores(data: MatchScore): void {
    this.frameNumber = data.homePlayerFrames + data.awayPlayerFrames + 1;
    this.homePlayer.frames = data.homePlayerFrames;
    this.homeScore = data.homePlayerPointsInCurrentFrame;
    this.homePlayer.currentBreak = data.homePlayerCurrentBreak;
    this.awayPlayer.frames = data.awayPlayerFrames;
    this.awayScore = data.awayPlayerPointsInCurrentFrame;
    this.awayPlayer.currentBreak = data.awayPlayerCurrentBreak;
  }

  trackByFrame(index: number, f: FrameScore) {
    return f.frame;
  }

  subscribe(): void {
    const email = prompt('Enter your email to subscribe for updates:');
    if (email) {
      fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, match_id: this.matchId }),
      })
      .then(async response => {
        if (response.ok) {
          alert('Successfully subscribed!');
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Subscription failed');
        }
      })
      .catch(error => {
        alert(`Error: ${error.message}`);
      });
    }
  }
}
