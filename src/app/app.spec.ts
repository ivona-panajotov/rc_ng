import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { TableData } from './table-data';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: TableData, useValue: { getData: () => of([]) } },
        provideCharts(withDefaultRegisterables())
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the employee hours heading', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Ukupni sati zaposlenih');
  });
});
