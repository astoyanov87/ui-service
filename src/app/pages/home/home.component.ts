import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Match {
  id: string;
  player1: string;
  player2: string;
  player1Image: string;
  player2Image: string;
  status: 'live' | 'scheduled' | 'completed';
  round: number;
  score?: string;
  scheduledTime?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  activeTab: 'live' | 'scheduled' | 'completed' = 'live';

  matches: Match[] = [
    {
      id: '001',
      player1: "Ronnie O'Sullivan",
      player2: 'Mark Selby',
      player1Image: 'https://img.gc.wstservices.co.uk/fit-in/400x600/e8657630-9b70-11ee-915b-9df84a982bbd.png',
      player2Image: 'https://img.gc.wstservices.co.uk/fit-in/400x600/77596b70-9b72-11ee-913a-4bc98ac612d5.png',
      status: 'live',
      round: 3,
      score: '10-8'
    },
    {
      id: '002',
      player1: 'Neil Robertson',
      player2: 'Judd Trump',
      player1Image: 'https://img.gc.wstservices.co.uk/fit-in/400x600/bc377640-9b7e-11ee-b817-916de7e0a6fb.png',
      player2Image: 'https://img.gc.wstservices.co.uk/fit-in/400x600/77596b70-9b72-11ee-913a-4bc98ac612d5.png',
      status: 'live',
      round: 2,
      score: '7-9'
    },
    {
      id: '003',
      player1: 'John Higgins',
      player2: 'Kyren Wilson',
      player1Image: 'https://img.gc.wstservices.co.uk/fit-in/400x600/77596b70-9b72-11ee-913a-4bc98ac612d5.png',
      player2Image: 'https://img.gc.wstservices.co.uk/fit-in/400x600/77596b70-9b72-11ee-913a-4bc98ac612d5.png',
      status: 'scheduled',
      round: 4,
      scheduledTime: '2024-10-15 18:00'
    },
    {
      id: '004',
      player1: 'Mark Allen',
      player2: 'Shaun Murphy',
      player1Image: 'https://img.gc.wstservices.co.uk/fit-in/400x600/77596b70-9b72-11ee-913a-4bc98ac612d5.png',
      player2Image: 'https://img.gc.wstservices.co.uk/fit-in/400x600/77596b70-9b72-11ee-913a-4bc98ac612d5.png',
      status: 'completed',
      round: 1,
      score: '11-5'
    }
  ];

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
