import {Component, computed, effect, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Colors, Keys, Levels} from "../shared/models";

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})

export class PasswordComponent {
  specialCharacters = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g
  numberRE = /[0-9]/g

  levels = {
    0: {
      field1: "grey", field2: "grey", field3: "grey"
    },
    1: {
      field1: "red", field2: "red", field3: "red"
    },
    2: {
      field1: "red", field2: "grey", field3: "grey"
    },
    3: {
      field1: "yellow", field2: "yellow", field3: "grey"
    },
    4: {
      field1: "green", field2: "green", field3: "green"
    },
  }

  password: WritableSignal<string> = signal('');

  sectionColors: WritableSignal<{ field1: string; field3: string; field2: string }> = signal(this.levels[0]);

  passwordLevel: Signal<number> = computed(() => {
    let level = 0;
    const val = this.password();
    if (val.length >= 8) {
      level = 1;
      level += this.levelUp(val);
    } else {
      level = val.length > 0 ? 1 : 0;
    }
    return level
  })

  updateEffect = effect(() => {
    this.sectionColors.set(this.levels[this.passwordLevel() as keyof typeof this.levels])
  }, {allowSignalWrites: true})

  passwordStrength = computed(() => {
    switch (this.passwordLevel()) {
      case 1: {
        return 'Need more signs'
      }
      case 2: {
        return 'Easy'
      }
      case 3: {
        return 'Medium'
      }
      case 4: {
        return "Strong"
      }
      default : {
        return "Need more signs"
      }
    }
  })

  levelUp(val: string) {
    return this.isContainingLetters(val) + this.isContainingSpecialCharacters(val) + this.isContainingNumbers(val)
  }

  isContainingSpecialCharacters(pass: string) {
    return pass.match(this.specialCharacters) ? 1 : 0;
  }

  isContainingNumbers(pass: string) {
    return pass.match(this.numberRE) ? 1 : 0;
  }

  isContainingLetters(pass: string) {
    const lettersRE = /[A-Za-z]/g
    return pass.match(lettersRE) ? 1 : 0;
  }
}
