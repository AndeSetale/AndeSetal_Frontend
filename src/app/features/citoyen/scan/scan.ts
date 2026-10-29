import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IncidentService } from '../../../core/services/incident.service';

@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './scan.html',
  styleUrl: './scan.css',
})
export class ScanComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  stream: MediaStream | null = null;
  capturedPhoto: string | null = null;
  isCameraActive: boolean = false;
  cameraError: string | null = null;

  constructor(
    private router: Router,
    private incidentService: IncidentService
  ) {}

  ngOnInit(): void {
    this.startCamera();
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  async startCamera(): Promise<void> {
    this.cameraError = null;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (this.videoElement && this.videoElement.nativeElement) {
          this.videoElement.nativeElement.srcObject = this.stream;
        }
        this.isCameraActive = true;
      } else {
        this.cameraError = 'Appareil photo non supporté sur ce navigateur.';
      }
    } catch (err) {
      console.warn('Accès caméra refusé ou indisponible', err);
      this.isCameraActive = false;
      this.cameraError = 'Caméra non disponible. Vous pouvez sélectionner une photo depuis votre galerie.';
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.isCameraActive = false;
  }

  capturePhoto(): void {
    if (this.isCameraActive && this.videoElement && this.canvasElement) {
      const video = this.videoElement.nativeElement;
      const canvas = this.canvasElement.nativeElement;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        this.capturedPhoto = canvas.toDataURL('image/jpeg', 0.85);
        this.stopCamera();
      }
    } else {
      // Caméra indisponible : le citoyen choisit une photo dans sa galerie
      this.triggerFileInput();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.capturedPhoto = e.target?.result as string;
        this.stopCamera();
      };
      reader.readAsDataURL(file);
    }
  }

  retakePhoto(): void {
    this.capturedPhoto = null;
    this.startCamera();
  }

  async confirmPhoto(): Promise<void> {
    if (this.capturedPhoto) {
      this.incidentService.setDraftPhoto(this.capturedPhoto);
      // Déclencher la géolocalisation GPS réelle et le reverse geocoding
      await this.incidentService.fetchCurrentLocation();
      this.router.navigate(['/mobile/enregistrement']);
    }
  }

  triggerFileInput(): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }

  goBack(): void {
    this.router.navigate(['/mobile']);
  }
}
