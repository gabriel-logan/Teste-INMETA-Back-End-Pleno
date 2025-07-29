import { ApiProperty } from "@nestjs/swagger";

export class UpdateEmployeePasswordResponseDto {
  @ApiProperty({
    type: String,
    description: "Message indicating the result of the password update",
    example: "Password updated successfully",
  })
  public readonly message: string;
}
