import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  activeTab: 'live' | 'scheduled' | 'completed' = 'live';
  tournamentName: string = '';
  matches: Match[] = [];
  
  get tabTitle(): string {
    switch (this.activeTab) {
      case 'live': return 'Live Matches';
      case 'scheduled': return 'Scheduled Matches';
      case 'completed': return 'Completed Matches';
      default: return 'Matches';
    }
  }

  trackByMatchID(index: number, item: Match) {
    return item.matchID;
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Match[]>('/api/v1/matches').subscribe({
      next: (matches) => {
        // Normalize status to lowercase for filtering
        this.matches = matches.map(match => ({
          ...match,
          status: match.status.toLowerCase() as 'live' | 'scheduled' | 'completed'
        }));
        // Set tournament name
        this.tournamentName = this.matches[0]?.tournamentName || 'Snooker Tournament';
        console.log(this.matches);
      },
      error: (error) => {
        console.error('Error fetching matches:', error);
        // Handle error, e.g., show user-friendly message
      }
    });
  } 

  get filteredMatches(): Match[] {
    return this.matches.filter(m => m.status === this.activeTab);
  }

  setActiveTab(tab: 'live' | 'scheduled' | 'completed'): void {
    this.activeTab = tab;
  }

  subscribe(matchId: string): void {
    const email = prompt('Enter your email to subscribe for updates:');
    if (email) {
      fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, match_id: matchId }),
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
