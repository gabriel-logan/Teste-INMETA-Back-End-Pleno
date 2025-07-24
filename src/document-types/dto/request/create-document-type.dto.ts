import { ApiProperty } from "@nestjs/swagger";

export class CreateDocumentTypeRequestDto {
  @ApiProperty()
  public name: string;
}
