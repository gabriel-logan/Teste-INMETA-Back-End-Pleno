import { ApiProperty } from "@nestjs/swagger";

export class DocumentTypeEmployeeLinkedResponseDto {
  @ApiProperty({ type: [String] })
  public documentTypeIdsLinked: string[];
}
