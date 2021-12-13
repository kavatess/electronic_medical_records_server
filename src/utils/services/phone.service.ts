import { Injectable } from "@nestjs/common";

@Injectable()
export class PhoneService {
  public findPhoneInText(text: string): string[] {
    const phoneArr = [];
    const sentences = text.split("\n");
    sentences.forEach((sentence) => {
      if (sentence.trim()) {
        const specialCharRegArr = [];
        // Remove all special characters and store them to specialCharRegArr
        while (sentence.match(/\W/)) {
          specialCharRegArr.push(sentence.match(/\W/));
          sentence = sentence.replace(/\W/, "");
        }
        // Find phone number
        const phoneRegExp = new RegExp(/[\+]?\d{9}|\(\d{3}\)\s?-\d{6}/);
        while (phoneRegExp.exec(sentence)) {
          const phoneNumberReg = phoneRegExp.exec(sentence);
          let phoneNumber = phoneNumberReg[0];
          specialCharRegArr.reverse().forEach((specialCharReg) => {
            const specialCharIndex =
              specialCharReg.index - phoneNumberReg.index;
            if (specialCharIndex > 0 && specialCharIndex < 9)
              phoneNumber =
                phoneNumber.slice(0, specialCharIndex) +
                specialCharReg[0] +
                phoneNumber.slice(specialCharIndex);
          });
          sentence = sentence.replace(phoneNumberReg[0], "*********");
          phoneArr.push(phoneNumber);
        }
      }
    });
    return phoneArr;
  }
}
