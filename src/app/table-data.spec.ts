import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { TableData } from './table-data';

describe('TableData', () => {
  let service: TableData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(TableData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
