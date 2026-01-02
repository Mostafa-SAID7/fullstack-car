import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type OAuthProvider = 'google' | 'github' | 'facebook' | 'twitter' | 'microsoft';

interface ProviderConfig {
    name: string;
    icon: string;
    color: string;
    textColor: string;
}

@Component({
    selector: 'app-oauth-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './oauth-button.component.html',
    styleUrls: ['./oauth-button.component.scss']
})
export class OAuthButtonComponent {
    @Input() provider!: OAuthProvider;
    @Input() loading = false;
    @Input() disabled = false;
    @Output() clicked = new EventEmitter<void>();

    private providerConfigs: Record<OAuthProvider, ProviderConfig> = {
        google: {
            name: 'Google',
            icon: 'fa-brands fa-google',
            color: '#fff',
            textColor: '#757575'
        },
        github: {
            name: 'GitHub',
            icon: 'fa-brands fa-github',
            color: '#24292e',
            textColor: '#fff'
        },
        facebook: {
            name: 'Facebook',
            icon: 'fa-brands fa-facebook',
            color: '#1877f2',
            textColor: '#fff'
        },
        twitter: {
            name: 'Twitter',
            icon: 'fa-brands fa-twitter',
            color: '#1da1f2',
            textColor: '#fff'
        },
        microsoft: {
            name: 'Microsoft',
            icon: 'fa-brands fa-microsoft',
            color: '#00a4ef',
            textColor: '#fff'
        }
    };

    get config(): ProviderConfig {
        return this.providerConfigs[this.provider];
    }

    get buttonStyle() {
        return {
            'background-color': this.config.color,
            'color': this.config.textColor,
            'border-color': this.provider === 'google' ? '#dadce0' : this.config.color
        };
    }

    onClick(): void {
        if (!this.loading && !this.disabled) {
            this.clicked.emit();
        }
    }
}
