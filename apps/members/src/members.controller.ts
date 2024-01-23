import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common'
import { MembersService } from './members.service'
import { Member } from '@app/entities/members/member.entity'
import { CreateMemberDto } from './dto/create-member.dto'
import { UpdateMemberDto } from './dto/update-member.dto'

@Controller()
export class MembersController {
	constructor(private readonly membersService: MembersService) {}

	@Get()
	getMembers(): Promise<Member[]> {
		return this.membersService.findAll()
	}

	@Get('/:id')
	getMember(@Param('id') id: string): Promise<Member> {
		return this.membersService.findOneBy('id', id)
	}

	@Post()
	createMember(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
		return this.membersService.create(createMemberDto)
	}

	@Put('/:id')
	updateMember(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto): Promise<void> {
		return this.membersService.update(id, updateMemberDto)
	}

	@Patch('/:id/role')
	updateRole(@Param('id') id: string, @Body('role') role: number): Promise<void> {
		return this.membersService.updateRole(id, role)
	}

	@Patch('/:id/delete')
	deleteMember(@Param('id') id: string): Promise<void> {
		return this.membersService.delete(id)
	}
}
