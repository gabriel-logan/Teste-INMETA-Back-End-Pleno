import { ApiProperty } from "@nestjs/swagger";
import { EmployeeRole } from "src/employees/schemas/employee.schema";

class SignInAuthResponseEmployeeDto {
  @ApiProperty({
    type: String,
    format: "objectId",
  })
  public readonly id: string;

  @ApiProperty({
    type: String,
    description: "The username of the employee",
  })
  public readonly username: string;

  @ApiProperty({
    enum: EmployeeRole,
    example: EmployeeRole.ADMIN,
    description: "The role of the employee",
  })
  public readonly role: EmployeeRole;
}

export class SignInAuthResponseDto {
  @ApiProperty({
    type: String,
    description: "JWT access token",
  })
  public readonly accessToken: string;

  @ApiProperty({
    type: SignInAuthResponseEmployeeDto,
    description: "Details of the signed-in employee",
  })
  public readonly employee: SignInAuthResponseEmployeeDto;
}
