import { ApiProperty } from "@nestjs/swagger";
import { IsNotBlankString } from "src/common/decorators/validation/IsNotBlankString";

export class CreateDocumentRequestDto {
  @ApiProperty()
  @IsNotBlankString()
  public name: string;
}
