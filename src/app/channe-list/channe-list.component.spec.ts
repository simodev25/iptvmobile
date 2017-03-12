/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ChanneListComponent } from './channe-list.component';

describe('ChanneListComponent', () => {
  let component: ChanneListComponent;
  let fixture: ComponentFixture<ChanneListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChanneListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChanneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
