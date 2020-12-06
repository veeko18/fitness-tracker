import { Subscription } from 'rxjs/Subscription';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];

  /* runningExercise will store selected exercise if any */
  private runningExercise: Exercise;
  private fbSubs: Subscription;

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises() {
    /* slice() will create the real copy of that array
      by calling slice() we can create a new array 
      without editing the old one. We need to inject angular
      firestore into the service to make db available */
    this.fbSubs.add(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .map((docArray) => {
          return docArray.map((doc: any) => {
            return {
              id: doc.payload.doc.id,
              name: doc.payload.doc.data().name,
              duration: doc.payload.doc.data().duration,
              calories: doc.payload.doc.data().calories,
            };
          });
        })
        .subscribe((exercises: Exercise[]) => {
          this.availableExercises = exercises;
          this.exercisesChanged.next([...this.availableExercises]);
        })
    );
  }

  startExercise(selectedId: string) {
    // this.db.doc('availableExercises/' + selectedId).update({
    //lastSelected: new Date(),
    //});
    /* selectedExercise can be found in availableExercises */
    const selectedExercise = this.availableExercises.find(
      /* we want to return true if ex.id equals to selectedId */
      (ex) => ex.id === selectedId
    );
    /* store selectedExercise in runningExercise */
    this.runningExercise = selectedExercise;
    /* new Object with same properties */
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  /* complete entire duration */
  completeExercise() {
    /* store runningExercises object (because we want
      to store some properties in that object) in exercises [] 
      with spread operator we can copy all the properties of the
      exercise */
    this.addDataToDB({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    /* this means we got no running exercise */
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  /* store how much we completed and calculate calories burnt */
  cancelExrecise(progress: number) {
    /* store runningExercises object (because we want
      to store some properties in that object) in exercises [] 
      with spread operator we can copy all the properties of the
      exercise */
    this.addDataToDB({
      ...this.runningExercise,
      /* we need to overwrite duration and calories as
        exercise is not finished */
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    /* this means we got no running exercise */
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    /* we return new Object which is simply a copy 
    of current exercise */
    return { ...this.runningExercise };
  }

  fetchCompletedOrCancelledExercises() {
    /* slice() means adding a new copy og exercises */
    this.fbSubs.add(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.finishedExercisesChanged.next(exercises);
        })
    );
  }

  cancelSubsriptions() {
    this.fbSubs.unsubscribe();
  }

  private addDataToDB(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
