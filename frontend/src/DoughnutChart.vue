<script>
import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  props:['chartData','options'],
  methods: {
    update() {
      this.renderChart(this.chartData, this.options)
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
};
</script>
