import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, err: null };
  }
  static getDerivedStateFromError() {
    return { hasError: true, err: error };
  }
  componentDidCatch(error, info) {
    console.error("Lỗi trong component:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: 20}}>
          <h3>Đã xảy ra lỗi. Vui lòng thử lại.</h3>;
          <button onClick={() => location.reload()}>Tải lại trang</button>
        </div>
      )
    }
    return this.props.children;
  }
}
