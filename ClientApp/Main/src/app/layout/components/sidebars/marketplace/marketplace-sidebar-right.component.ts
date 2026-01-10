import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-marketplace-sidebar-right',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule],
    template: `
        <div class="p-4 flex flex-col items-center justify-center text-center space-y-4">
            <div class="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
                <i class="fa-solid fa-shop-lock text-3xl"></i>
            </div>
            <h3 class="text-xs font-black text-foreground uppercase tracking-tight">Market Intel</h3>
            <p class="text-[10px] text-muted-foreground font-medium leading-relaxed">
                Personalized offers and nearby services will appear here based on your preferences.
            </p>
            <button class="px-6 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                Update Preferences
            </button>
        </div>
    `
})
export class MarketplaceSidebarRightComponent { }
