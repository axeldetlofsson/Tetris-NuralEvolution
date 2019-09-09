function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}
class NeuralNetwork {
  constructor(a, b, c) {
    if (a instanceof NeuralNetwork) {
      this.input_nodes = a.input_nodes;
      this.hidden_nodes = a.hidden_nodes;
      // this.sHidden_nodes = a.sHidden_nodes;
      // this.ssHidden_nodes = a.ssHidden_nodes;
      this.output_nodes = a.output_nodes;
      this.weights_ih = a.weights_ih.copy();
      // this.weights_sh = a.weights_sh.copy();
      // this.weights_ss = a.weights_ss.copy();
      this.weights_ho = a.weights_ho.copy();
      this.bias_h = a.bias_h.copy();
      this.bias_o = a.bias_o.copy();
      // this.bias_ss = a.bias_ss.copy();
      // this.bias_s = a.bias_s.copy();
    } else {
      this.input_nodes = a;
      this.hidden_nodes = b;
      //this.sHidden_nodes = c;
      //this.ssHidden_nodes = d;
      this.output_nodes = c;
      this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
      //  this.weights_sh = new Matrix(this.sHidden_nodes, this.hidden_nodes);
      //this.weights_ss = new Matrix(this.ssHidden_nodes, this.sHidden_nodes);
      this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
      this.weights_ih.randomize();
      //this.weights_sh.randomize();
      //this.weights_ss.randomize();
      this.weights_ho.randomize();
      // this.bias_s = new Matrix(this.sHidden_nodes, 1);
      // this.bias_ss = new Matrix(this.ssHidden_nodes, 1);
      this.bias_h = new Matrix(this.hidden_nodes, 1);
      this.bias_o = new Matrix(this.output_nodes, 1);
      this.bias_h.randomize();
      // this.bias_ss.randomize();
      // this.bias_s.randomize();
      this.bias_o.randomize();
    }
  }
  MateWith(matesBrain) {
    this.mergeWeights(this.weights_ih, matesBrain.weights_ih);
    this.mergeWeights(this.weights_ho, matesBrain.weights_ho);
    this.mergeWeights(this.bias_h, matesBrain.bias_h);
    this.mergeWeights(this.bias_o, matesBrain.bias_o);
  }
  mergeWeights(myWeights, matesWeights) {
    for (let y = 0; y < matesWeights.matrix.rows; y++) {
      for (let x = 0; x < matesWeights.matrix.cols; x++) {
        if (Math.random() > 0.5) {
          myWeights.matrix[y][x] = matesWeights.matrix[y][x];
        }
      }
    }
  }
  feedforward(input_array) {
    let convert = input_array.toArray();
    let inputs = Matrix.fromArray(convert);
    let hidden = Matrix.dot(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    hidden.map(sigmoid);
    // let sHidden = Matrix.dot(this.weights_sh, hidden);
    // sHidden.add(this.bias_s);
    // sHidden.map(sigmoid);
    // let ssHidden = Matrix.dot(this.weights_ss, sHidden);
    // ssHidden.add(this.bias_ss);
    // ssHidden.map(sigmoid);
    let output = Matrix.dot(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(sigmoid);
    return output.toArray();
  }
  copy() {
    return new NeuralNetwork(this);
  }
  mutate(rate) {
    function mutate(val) {
      if (Math.random() < rate) {
        return val + randomGaussian(0, 1);
        //return Math.random() * 2 - 1;
      } else {
        return val;
      }
    }
    this.weights_ih.map(mutate);
    // this.weights_sh.map(mutate);
    this.weights_ho.map(mutate);
    // this.weights_ss.map(mutate);
    this.bias_h.map(mutate);
    // this.bias_s.map(mutate);
    this.bias_o.map(mutate);
    // this.bias_ss.map(mutate);
  }
}