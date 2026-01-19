import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-community-feed',
    standalone: true,
    imports: [
        CommonModule
    ],
    template: `
        <div class="community-feed">
            <div class="container mx-auto px-4 py-6">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Community Feed</h1>
                
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Main Feed -->
                    <div class="lg:col-span-2">
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <p class="text-gray-600 dark:text-gray-400">Community feed content will be displayed here.</p>
                        </div>
                    </div>
                    
                    <!-- Sidebar -->
                    <div class="lg:col-span-1">
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                            <p class="text-gray-600 dark:text-gray-400">Sidebar content will be displayed here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class CommunityFeedComponent { }
