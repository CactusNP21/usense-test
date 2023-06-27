import {ChangeDetectionStrategy, Component, computed, effect, Signal, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PasswordComponent {
  passwordCheckList = {
    long: false,
    digits: false,
    letter: false,
    specChar: false
  }
  passwordCheckListSignal = signal(this.passwordCheckList)

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
    let level;
    const pass = this.password();
    const newLevels = this.newLevel(pass);
    if (pass.length >= 8) {
      this.passwordCheckList.long = true;
      level = 1;
      level += newLevels;
    } else {
      this.passwordCheckList.long = false;
      level = pass.length > 0 ? 1 : 0;
    }
    return level
  })

  updateEffect = effect(() => {
    this.sectionColors.set(this.levels[this.passwordLevel() as keyof typeof this.levels]);
  }, {allowSignalWrites: true})

  passwordStrength = computed(() => {
    switch (this.passwordLevel()) {
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
        return "Need more symbols"
      }
    }
  })

  newLevel(val: string) {
    return +this.isContainingDigits(val) +
    +this.isContainingLetters(val) +
    +this.isContainingSpecialCharacters(val);

  }

  isContainingSpecialCharacters(pass: string) {
    const specialCharacters = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
    const match = !!pass.match(specialCharacters)
    this.passwordCheckList.specChar = match;
    return match;
  }

  isContainingDigits(pass: string) {
    const digitsRE = /[0-9]/g
    const match = !!pass.match(digitsRE)
    this.passwordCheckList.digits = match;
    return match;
  }

  isContainingLetters(pass: string) {
    const lettersRE = /[A-Za-z]/g
    const match = !!pass.match(lettersRE)
    this.passwordCheckList.letter = match;
    return match;
  }

  btnText = signal('Show')

  changeVisibility(input: HTMLInputElement) {
    input.type = input.type === 'password' ? 'text' : 'password'
    this.btnText.set(this.btnText() === 'Show' ? 'Hide' : 'Show')
  }
}
