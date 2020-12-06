import { TrainingService } from './training.service';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit {
  ongoingTraining = false;
  exerciseSubsription: Subscription;

  constructor(private trainingServicse: TrainingService) {}

  ngOnInit(): void {
    this.exerciseSubsription = this.trainingServicse.exerciseChanged.subscribe(
      (exercise) => {
        if (exercise) {
          this.ongoingTraining = true;
        } else {
          this.ongoingTraining = false;
        }
      }
    );
  }
}

/* let's get informed whether the user picked new
component or not */
