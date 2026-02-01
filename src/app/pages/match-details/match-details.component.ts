import { Component, OnInit, OnDestroy } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
    name: 'Player 1',
    image: 'https://img.gc.wstservices.co.uk/fit-in/600x600/bbcc5860-9b7e-11ee-b817-916de7e0a6fb.png',
    frames: 0,
    currentBreak: 0
  };

  awayPlayer = {
    name: 'Player 2',
    image: 'https://img.gc.wstservices.co.uk/fit-in/600x600/f3419990-9b47-11ee-a4af-d7e956654f38.png',
    frames: 0,
    currentBreak: 0
  };

  homeScore = 0;
  awayScore = 0;
  frameNumber = 1;

  frameScores: FrameScore[] = [
    { frame: 1, player1Score: 100, player2Score: 67 },
    { frame: 2, player1Score: 45, player2Score: 89 },
    { frame: 3, player1Score: 76, player2Score: 12 }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.matchId = this.route.snapshot.paramMap.get('id') || '';
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
