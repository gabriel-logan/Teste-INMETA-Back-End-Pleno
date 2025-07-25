import { ApiProperty } from "@nestjs/swagger";

export class DocumentTypeEmployeeUnlinkedResponseDto {
  @ApiProperty({ type: [String] })
  public documentTypeIdsUnlinked: string[];
}
