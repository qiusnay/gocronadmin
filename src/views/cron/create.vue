<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <el-row>
        <el-col :span="24">
          <div class="postInfo-container">
            <el-form-item style="margin-bottom: 20px;" prop="jobname">
              <MDinput v-model="postForm.jobname" :maxlength="100" name="jobname" required>作业名称</MDinput>
            </el-form-item>
            <el-form-item style="margin-bottom: 20px;" prop="jobtype">
              <el-form-item class="postInfo-container-item">
                <cron-option :onChildChange="SelectChange" :options="jobtype" :initselect="'请选择作业类型'"/>
              </el-form-item>
              <el-form-item label-width="30px" class="postInfo-container-item">
                <el-input v-model="postForm.email" :rows="1" name="email" type="input" class="article-textarea" autosize placeholder="报警邮箱" />
              </el-form-item>
              <el-form-item label-width="30px" class="postInfo-container-item">
                <el-input v-model="postForm.phone" :rows="1" name="phone" type="input" class="article-textarea" autosize placeholder="报警手机" />
              </el-form-item>
              <el-form-item label-width="30px" class="postInfo-container-item">
                <el-select v-model="postForm.author" :remote-method="getRemoteUserList" filterable default-first-option remote placeholder="属主">
                  <el-option v-for="(item,index) in userListOptions" :key="item+index" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item class="postInfo-container-item">
              <el-select v-model="postForm.rule" :remote-method="getRemoteUserList" filterable default-first-option remote placeholder="检索 Rule 规则">
                <el-option v-for="(item,index) in userListOptions" :key="item+index" :label="item" :value="item" />
              </el-select>
              <el-radio-group v-model="postForm.runyear" style="margin-left:10px;">
                <el-radio class="radio" :label="0">每年执行</el-radio>
                <el-radio class="radio" :label="1">今年执行</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-row class="postInfo-container" style="clear:left">
              <!-- <el-input v-model="postForm.command" :rows="1" type="textarea" class="article-textarea" autosize placeholder="执行命令" /> -->
              <el-form-item style="margin-bottom: 20px;" prop="jobname">
              <MDinput v-model="postForm.command" :maxlength="100" name="jobname" required>执行命令</MDinput>
            </el-form-item>
            </el-row>
            <el-row class="postInfo-container" style="clear:left">
              <el-form-item class="postInfo-container-item">
                <el-radio-group v-model="postForm.status">
                  <el-radio class="radio" :label="0">开启</el-radio>
                  <el-radio class="radio" :label="1">暂停</el-radio>
              </el-radio-group>
              </el-form-item>
            </el-row>
            <el-form-item class="postInfo-container-item">
              <cron-option :onChildChange="SelectChange"  :options="machinelist" :initselect="'请选择执行机器'"/>
            </el-form-item>

            <el-row class="postInfo-container" style="clear:left">
              <el-form-item class="postInfo-container-item" label-width="80px" label="超时机制:">
                <el-radio-group v-model="postForm.timeout">
                  <el-radio class="radio" :label="0">邮件短信通知</el-radio>
                  <el-radio class="radio" :label="1">强杀</el-radio>
                  <el-radio class="radio" :label="2">健康检查</el-radio>
                  <el-radio class="radio" :label="3">同步执行</el-radio>
              </el-radio-group>
              </el-form-item>
            </el-row>
            <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
              <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
                保存
              </el-button>
              <el-button v-loading="loading" type="warning" @click="resetForm">
                重置
              </el-button>
            </sticky>
            <!-- <el-col :span="10">
              <el-form-item label-width="120px" label="Publish Time:" class="postInfo-container-item">
                <el-date-picker v-model="displayTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Select date and time" />
              </el-form-item>
            </el-col>

              <el-col :span="6">
                <el-form-item label-width="90px" label="Importance:" class="postInfo-container-item">
                  <el-rate
                    v-model="postForm.importance"
                    :max="3"
                    :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                    :low-threshold="1"
                    :high-threshold="3"
                    style="display:inline-block"
                  />
                </el-form-item>
              </el-col> -->
          </div>
        </el-col>
        </el-row>
        <!-- <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item> -->
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchArticle } from '@/api/article'
import { searchUser } from '@/api/remote-search'
import CronOption from './components/CronOption'
const defaultForm = {
  status: 0,
  runyear: 0, // 执行年份
  timeout: 0, // 超时机制
  rule: '', // 前台展示时间
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}
export default {
  name: 'croncreate',
  components: { Tinymce, MDinput, Upload, Sticky, CronOption},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      jobtype: ['请选择作业类型', 'php', 'php7', 'curl', 'java'],
      machinelist : ['请选择执行机器', '192.168.2.74|192.168.2.77', '192.168.2.75', '192.168.2.216', '192.168.2.198'],
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        jobname: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {},
    }
  },
  computed: {
    // displayTime: {
    //   get() {
    //     return (+new Date(this.postForm.display_time))
    //   },
    //   set(val) {
    //     this.postForm.display_time = new Date(val)
    //   }
    // }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response.data
        // just for test
        this.postForm.jobname += `   Article Id:${this.postForm.id}`
        this.postForm.content_short += `   Article Id:${this.postForm.id}`
        // set tagsview title
        this.setTagsViewTitle()
        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    SelectChange(e){
      // this.jobtype = e.
      console.log('jsdebug','change from child',e)
    },
    setTagsViewTitle() {
      const title = 'cron 作业创建'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'cron 作业创建'
      document.title = `${title} - ${this.postForm.id}`
    },
    resetForm() {

    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '发布文章成功',
            type: 'success',
            duration: 2000
          })
          this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}
.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>