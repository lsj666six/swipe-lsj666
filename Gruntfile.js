//包装函数
module.exports = function(grunt){
    //任务配置，所有插件的配置信息
    grunt.initConfig({

        //获取package.json的信息
        pkg: grunt.file.readJSON('package.json'),
		//第一步：配置uglify.json的信息
		    uglify:{
		        options:{
		            banner:'/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
	            },
		        build:{
		            src:'src/swipe.js',
		            dest:'dist/<%=pkg.name%>-<%= pkg.version%>.min.js'
	            }
	        },
		//jshint的插件配置信息
		        jshint:{
		            build:['Gruntfile.js','src/*.js'],
		            options:{
		                jshintrc:'.jshintrc' //检测JS代码错误要根据此文件的设置规范进行检测，可以自己修改规则
		            }
		        },
				
				
				//clean配置文件
					clean:{
				       contents: ['dist/*','sample/js/*.js'],
				       },
						
				//csslint插件配置
				csslint:{
				            options:{
				                csslintrc:'.csslint'
				            },
				            build:['src/css/*.css']
				 
				        },

				// copy插件的配置信息
				copy: {
					main: {
						files: [
							//完复制整个目录的的所有文件到指定目录
							// {expand: true, src: ['path/*'], dest: 'dest/', filter: 'isFile'},
							// 拷贝整个目录的所有文件及子目录到指定目录
							//{expand: true, src: ['path/**'], dest: 'dest/'},
							//进入某个目录下，拷贝文件到指定目录
							{expand: true, cwd: 'dist/', src: ['**'], dest: 'sample/js/'},
						],
					},
				},
				
				//replace配置文件（替换）
				replace: {
				  another_example: {
				    src: ['sample/demo.html'],
				    overwrite: true,                 // overwrite matched source files
				    replacements: [{
				      from: /-\d{1,}\.\d{1,}\.\d{1,}/g,
				      to: "-<%= pkg.version %>"
				    }]
				  }
				},
		
		//concat配置文件
		 concat: {
		    options: {
				separator: ';',//两个合并的代码分割点
				stripBanners: true,//如果为true，去除代码中的块注释，默认为false
				banner: '2020-4-12'
		    },
		    dist:{
				src:['src/a.js', 'src/b.js'],//要合并的文件
				dest:'dist/all.js'//合并完叫的名字和存放的位置
		    },
		}
		
		
    });
	//使用插件第二步：加载插件
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-text-replace');
	// grunt.loadNpmTasks('grunt-contrib-csslint');
	// grunt.loadNpmTasks('grunt-contrib-concat');
    //告诉grunt当我们在终端中输入grunt时需要做些什么（注意先后顺序）
	//使用插件第三步：在任务中注册插件
    grunt.registerTask('default',['jshint','clean','uglify','copy','replace']);
};