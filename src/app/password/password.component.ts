import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EffectRef,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Colors, Keys, Levels, PasswordCheckList, PasswordStrength} from "../shared/models";

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PasswordComponent {
  passwordCheckList: PasswordCheckList = {
    long: false,
    digit: false,
    letter: false,
    symbol: false
  }
  passwordCheckListSignal: WritableSignal<PasswordCheckList> = signal(this.passwordCheckList)

  levels: Levels = {
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

  sectionColors: WritableSignal<Record<Keys, Colors>> = signal(this.levels[0]);

  passwordLevel: Signal<number> = computed(() => {
    let level;
    const pass = this.password();
    const newLevels = this.calculateStrength(pass);
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

  _updateEffect: EffectRef = effect(() => {
    this.sectionColors.set(this.levels[this.passwordLevel() as keyof typeof this.levels]);
  }, {allowSignalWrites: true})

  passwordStrength: Signal<PasswordStrength> = computed(() => {
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
        return "Not enough symbols"
      }
    }
  })

  calculateStrength(val: string): number {
    return +this.isContainingDigit(val) +
      +this.isContainingLetter(val) +
      +this.isContainingSymbol(val);
  }

  isContainingSymbol(pass: string): boolean {
    const specialCharacters = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
    const match = !!pass.match(specialCharacters)
    this.passwordCheckList.symbol = match;
    return match;
  }

  isContainingDigit(pass: string): boolean {
    const digitsRE = /[0-9]/g
    const match = !!pass.match(digitsRE)
    this.passwordCheckList.digit = match;
    return match;
  }

  isContainingLetter(pass: string): boolean {
    const lettersRE = /[A-Za-z]/g
    const match = !!pass.match(lettersRE)
    this.passwordCheckList.letter = match;
    return match;
  }

  btnText: WritableSignal<"Show" | "Hide"> = signal('Show')

  changeVisibility(input: HTMLInputElement) {
    input.type = input.type === 'password' ? 'text' : 'password'
    this.btnText.set(this.btnText() === 'Show' ? 'Hide' : 'Show')
  }
}
