export class ConsultFileInfo {
  video: number;
  audio: number;
  image: number;
}

export class ConsultationFileInfo {
  consultation: string;
  files: ConsultFileInfo = {
    video: 0,
    audio: 0,
    image: 0,
  };

  constructor(consultation: string) {
    this.consultation = consultation;
  }
}
