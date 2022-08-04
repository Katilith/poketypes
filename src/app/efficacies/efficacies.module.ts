import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { EfficaciesComponent } from './efficacies.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { StrengthsComponent } from './strengths/strengths.component';
import { WeaknessesComponent } from './weaknesses/weaknesses.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({
    declarations: [
        EfficaciesComponent,
        StrengthsComponent,
        WeaknessesComponent
    ],
    providers: [
        TitleCasePipe
    ],
    exports: [
        EfficaciesComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatCardModule,
        MatDividerModule
    ]
})
export class EfficaciesModule {
}
