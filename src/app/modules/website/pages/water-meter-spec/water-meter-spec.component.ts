import { Component } from '@angular/core';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb';

export interface WaterMeterItem {
  id: number;
  description: string;
  publishDate: string;
  fileUrl: string;
}

@Component({
  selector: 'app-water-meter-spec',
  standalone: true,
  imports: [DocumentListComponent, BreadcrumbComponent],
  templateUrl: './water-meter-spec.component.html',
  styleUrl: './water-meter-spec.component.scss',
})
export class WaterMeter {
  breadcrumb: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Notice Board', route: '/notice-board' },
    { label: 'Water Meter Specifications' },
  ];

  tableColumns: TableColumn[] = [
    { key: 'description', label: 'Description', widthClass: 'col-7' },
    { key: 'publishDate', label: 'Publish Date', widthClass: 'col-2' },
    { key: 'fileUrl', label: 'Download', type: 'download', widthClass: 'col-2' }
  ];

  documents: WaterMeterItem[] = [
    {
      id: 1,
      description: 'Specification for Digital Water Level Recorders',
      publishDate: '2023-07-19',
      fileUrl:'https://SDSO.punjab.gov.in/myattachments?path=eyJpdiI6InN5dFQvUmhROWJMM0NwSmt4c1JoR0E9PSIsInZhbHVlIjoiVzFiNnBEZlNhdlB2UElyTkE3U01ySkJlSHF1N1ZSY0JwSm8wblpIcW9YNmttTHFDWE0xelBWanRlYklkOUVUQ1A2T2d6NytYNVYxa0VxNkVubTRKUU5US2tiZ3NTV2Y2Z3RnWi9TK2l6K0JQcXF6UmdPelo3TVBCdysxMGVpWEgycE9GcUEwYWo4b0FZY2hzdE5tTVZWNk9XeGFWYjJlZ0FNMVhpbzF3OXUyZHdzRjFOc2llVC8rT3B6OGN6cnljWVdTWnFSamd0TEkzcG9VODVDa2lDVktoc1ovQitoY2lWN1JqZHlTU3dsM1VHbEFla2FPMFQwWDc4MjdwajhiNktaWlBVWkpmaEhKempqL21ESkVSbmtXWjdJTEJLdmhqOW9JWHdhY1B0MVNDSitrZ3l1UGJKdWp6MGlLUmw2NkxESEZMUDVNdEo3Ri9GSlNDWEprQTNnPT0iLCJtYWMiOiJiMzVjNjdjYzM1NDBlYTUzZThlZThmMjM0Y2IzOWY3ODlkZGNlZGJlODNlZWViNTEwMmMzMmVjM2JmMmNiYTljIiwidGFnIjoiIn0%3D',
    },
    {
      id: 2,
      description: 'Specifications for Digital and Mechanical Water Flow Meters',
      publishDate: '2023-07-19',
      fileUrl: 'https://SDSO.punjab.gov.in/myattachments?path=eyJpdiI6IjZmQVR3SmVGV3JOOXB3eGdETG1EL2c9PSIsInZhbHVlIjoidzZ3aStXRUlBcWVjU2p3aHdMZWhLY2xLWkVKNFNQR2h4SkNJRTB3dXlvQ3ZRRjZWektjSUpVbWREc1NLSFo4dlpCVmZqZVM1ODc1Tzl0VGFYenIrNVhDK0hMVUtZZGFlbUJ3VHdiMzZ6OEpJRmw2TWhQWDIweld1T2hqWkZZWnhCZHBhTDk4Zkw4dkpCOXdLZjBQbEJlamx3QlQvckhWMHB5c1pGL1htY21KSEZpWEpUWHplSU5XNXZYYkdmYno2T3dGKzA5T000QWwxb2lPeGU5aUJvQjYralI4d2x2RGRzOVJneUhQV3hDM3FPM2tseHQ5b0lMMTBvVkpBZUhMQ3hUNkVVcjJhb1haNzVOMUFXOUV1Nmp2S3ZCMHMrQ2FEbnRZNk0yL0NtMkQrcWJ0SEVGTXY2QXJZZXZNT3JzSjY3c05pcXM1UTlSVEFEYzdmQU9weE1nPT0iLCJtYWMiOiJjNjdjY2QwM2M2ZmVhYzgyNGVmNDhkZDExYjJhNzA1OTMwZjYyZDNkZTQxZGM5YjQ2NTQ0OGVkZjlkYjc3MWQ2IiwidGFnIjoiIn0%3D',
    },
  ];
}