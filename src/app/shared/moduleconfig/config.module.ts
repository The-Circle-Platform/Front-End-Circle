import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

export class CustomConfig {
    apiEndpoint!: string;
}

@NgModule({
    declarations: [],
    imports: [CommonModule],
    providers: [],
    exports: [],
})
export class ConfigModule {
    static forRoot(config: CustomConfig): ModuleWithProviders<ConfigModule> {
        return {
            ngModule: ConfigModule,
            providers: [{ provide: CustomConfig, useValue: config }],
        };
    }
}
