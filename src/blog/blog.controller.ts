import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  Req,
  Put,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { GlobalInterceptor } from 'src/interceptors/guard.interceptor';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('create')
  @UseInterceptors(GlobalInterceptor)
  async create(
    @Body() createBlogDto: any,
    @Req() req: Request & { user?: any },
  ) {
    return this.blogService.create(createBlogDto, req?.user.id);
  }

  @Get()
  findAll(@Query('page') page:number = 1,@Query('limit') limit:number = 10 ) {
    return this.blogService.findAll(page,limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(GlobalInterceptor)
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: any,
    @Req() req: Request & { user?: any },
  ) {
    console.log(id);
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @UseInterceptors(GlobalInterceptor)
  remove(@Param('id') id: string, @Req() req: Request & { user?: any }) {
    return this.blogService.remove(id, req.user.id);
  }
}
