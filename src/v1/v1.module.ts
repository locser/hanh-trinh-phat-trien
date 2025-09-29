import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { FormSubmissionsModule } from './form-submissions/form-submissions.module';
import { AuthModule } from './auth/auth.module';

const routes: Routes = [
	{
		path: 'v1',
		children: [FormSubmissionsModule, AuthModule],
	},
];

@Module({
	imports: [RouterModule.register(routes), FormSubmissionsModule, AuthModule],
	providers: [],
})
export class V1Module {}
